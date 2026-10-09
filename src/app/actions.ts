"use server";

import { createClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, message: "Please enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  // 23505 = already subscribed; treat it as success.
  if (error && error.code !== "23505") return { ok: false, message: "Something went wrong. Please try again." };
  return { ok: true, message: "Thanks! You're on the list." };
}

export async function sendContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (formData.get("website")) return { ok: true, message: "Thanks! We'll get back to you soon." }; // bot trap
  if (!name || !EMAIL_RE.test(email) || !message) {
    return { ok: false, message: "Please fill in your name, a valid email and a message." };
  }
  if (message.length > 5000) return { ok: false, message: "Your message is too long." };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  if (error) return { ok: false, message: "Something went wrong. Please try again." };
  return { ok: true, message: "Thanks! We'll get back to you soon." };
}
