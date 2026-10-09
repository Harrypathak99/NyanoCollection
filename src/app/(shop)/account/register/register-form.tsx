"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "../actions";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, null);

  if (state?.message) {
    return (
      <div className="bg-sand p-8 text-center">
        <h2 className="mb-3 text-[22px]">Check your email</h2>
        <p className="text-body">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="full_name" className="label">
          Full name
        </label>
        <input id="full_name" name="full_name" required autoComplete="name" className="input" />
      </div>
      <div>
        <label htmlFor="phone" className="label">
          Phone number
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className="input" />
      </div>
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={state?.email} className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password (at least 8 characters)
        </label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
      </div>
      {state?.error && (
        <p role="alert" className="text-[13px] text-red-600">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-dark w-full !py-3.5">
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-[14px] text-body">
        Already have an account?{" "}
        <Link href="/account/login" className="text-ink underline hover:text-accent">
          Log in
        </Link>
      </p>
    </form>
  );
}
