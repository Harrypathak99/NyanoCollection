"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CheckoutState = { error: string; fields?: Record<string, string> } | null;

type IncomingItem = { productId: string; color: string | null; quantity: number };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const field = (k: string) => String(formData.get(k) ?? "").trim();
  const fields = {
    name: field("name"),
    phone: field("phone"),
    email: field("email"),
    address: field("address"),
    city: field("city"),
    notes: field("notes"),
  };

  // Hidden field that people never fill in; bots usually do.
  if (field("company")) return { error: "Could not place the order.", fields };

  if (!fields.name || !fields.address || !fields.city) return { error: "Please fill in all required fields.", fields };
  if (!/^\+?[\d\s-]{7,20}$/.test(fields.phone)) return { error: "Please enter a valid phone number.", fields };
  if (fields.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) return { error: "Please enter a valid email.", fields };
  if (fields.notes.length > 1000 || fields.address.length > 500) return { error: "Your note or address is too long.", fields };

  let items: IncomingItem[];
  try {
    items = JSON.parse(field("items"));
  } catch {
    return { error: "Your cart could not be read. Please refresh and try again.", fields };
  }
  if (!Array.isArray(items) || items.length === 0) return { error: "Your cart is empty.", fields };

  // Only ids and quantities are sent; the database looks up the real prices.
  const payload = items
    .filter((i) => UUID_RE.test(String(i.productId)))
    .map((i) => ({
      product_id: i.productId,
      quantity: Math.max(1, Math.min(99, Math.floor(Number(i.quantity) || 1))),
      color: typeof i.color === "string" ? i.color.slice(0, 20) : null,
    }));

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: fields.name,
    p_phone: fields.phone,
    p_email: fields.email,
    p_address: fields.address,
    p_city: fields.city,
    p_notes: fields.notes,
    p_items: payload,
  });

  if (error || !data?.[0]) {
    const message = error?.message ?? "";
    if (message.includes("Not enough stock") || message.includes("not available")) {
      return { error: `${message}. Please update your cart.`, fields };
    }
    return { error: "We couldn't place your order. Please try again.", fields };
  }

  updateTag("products"); // stock changed
  redirect(`/checkout/success?order=${encodeURIComponent(data[0].order_number)}`);
}
