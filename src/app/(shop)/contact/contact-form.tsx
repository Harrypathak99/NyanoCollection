"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/app/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, null);

  if (state?.ok) {
    return (
      <div className="flex items-center justify-center bg-sand p-10 text-center">
        <p className="text-[18px]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 bg-sand p-6 sm:grid-cols-2 sm:p-10">
      <div>
        <label htmlFor="c-name" className="label">
          Name *
        </label>
        <input id="c-name" name="name" required className="input" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="c-email" className="label">
          Email *
        </label>
        <input id="c-email" name="email" type="email" required className="input" autoComplete="email" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="label">
          Message *
        </label>
        <textarea id="c-message" name="message" rows={6} required maxLength={5000} className="input" />
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
      {state && !state.ok && (
        <p role="alert" className="text-[13px] text-red-600 sm:col-span-2">
          {state.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-dark">
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
