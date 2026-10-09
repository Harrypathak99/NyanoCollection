"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderItem, OrderStatus } from "@/lib/types";

export type TrackedOrder = {
  order_number: string;
  status: OrderStatus;
  created_at: string;
  customer_name: string;
  city: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: OrderItem[];
};

export type TrackState = { order?: TrackedOrder; error?: string; fields?: { order: string; phone: string } } | null;

export async function trackOrder(_prev: TrackState, formData: FormData): Promise<TrackState> {
  const order = String(formData.get("order") ?? "").trim().slice(0, 40);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 20);
  const fields = { order, phone };
  if (!order || !phone) return { error: "Please enter your order number and phone number.", fields };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("track_order", { p_order_number: order, p_phone: phone });
  if (error) return { error: "Something went wrong. Please try again.", fields };
  if (!data) return { error: "We couldn't find an order with those details.", fields };
  return { order: data as TrackedOrder, fields };
}
