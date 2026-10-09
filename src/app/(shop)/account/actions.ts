"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string; email?: string } | null;

/** Only allow redirects back into this site. */
function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Please enter your email and password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = error.message.toLowerCase().includes("confirm")
      ? "Please confirm your email first. Check your inbox for the link."
      : "Incorrect email or password.";
    return { error: msg, email };
  }
  redirect(safeNext(formData.get("next")));
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!full_name || !email) return { error: "Please enter your name and email.", email };
  if (password.length < 8) return { error: "Password must be at least 8 characters.", email };

  const supabase = await createClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, phone }, emailRedirectTo: `${site}/auth/confirm?next=/account` },
  });
  if (error) return { error: error.message, email };

  // With email confirmation on (Supabase default) there is no session yet.
  if (!data.session) {
    return { message: "Almost done! We sent a confirmation link to your email. Click it to activate your account.", email };
  }
  redirect("/account");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export type ProfileState = { ok: boolean; message: string } | null;

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Please log in again." };

  const get = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 300) || null;
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: get("full_name"), phone: get("phone"), address: get("address"), city: get("city") })
    .eq("id", user.id);

  if (error) return { ok: false, message: "Could not save your details." };
  return { ok: true, message: "Your details were saved." };
}
