"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/actions";
import { ArrowRight, MailIcon } from "@/components/icons";

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, null);

  return (
    <form action={action} className="max-w-sm">
      <div className="flex items-center gap-3 border border-line px-3 py-2.5 focus-within:border-ink">
        <MailIcon size={14} className="text-ink" />
        <label htmlFor="newsletter-email" className="sr-only">
          Your email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Your email"
          className="flex-1 bg-transparent text-[12px] placeholder:text-ink focus:outline-none"
        />
        <button type="submit" aria-label="Subscribe" disabled={pending} className="text-body hover:text-accent">
          <ArrowRight size={14} />
        </button>
      </div>
      {state && (
        <p role="status" className={`mt-2 text-[12px] ${state.ok ? "text-green-700" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
