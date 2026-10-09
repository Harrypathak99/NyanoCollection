"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "../actions";

function NextField({ fallback }: { fallback: string }) {
  const next = useSearchParams().get("next") ?? fallback;
  return <input type="hidden" name="next" value={next} />;
}

export function LoginForm({ next }: { next: string | null }) {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : <NextField fallback="/account" />}
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" defaultValue={state?.email} className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      {state?.error && (
        <p role="alert" className="text-[13px] text-red-600">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-dark w-full !py-3.5">
        {pending ? "Logging in…" : "Log in"}
      </button>
      <p className="text-center text-[14px] text-body">
        New here?{" "}
        <Link href="/account/register" className="text-ink underline hover:text-accent">
          Create an account
        </Link>
      </p>
      <p className="text-center text-[13px] text-muted">
        No account needed to order —{" "}
        <Link href="/track-order" className="underline hover:text-accent">
          track an order
        </Link>{" "}
        with your order number.
      </p>
    </form>
  );
}
