"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import type { CurrentUser } from "@/lib/auth";

export function ProfileForm({ user }: { user: CurrentUser }) {
  const [state, action, pending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="space-y-4">
      {(
        [
          ["full_name", "Full name", user.full_name],
          ["phone", "Phone", user.phone],
          ["address", "Address", user.address],
          ["city", "City", user.city],
        ] as const
      ).map(([name, label, value]) => (
        <div key={name}>
          <label htmlFor={`p-${name}`} className="label">
            {label}
          </label>
          <input id={`p-${name}`} name={name} defaultValue={value ?? ""} className="input" />
        </div>
      ))}
      {state && <p className={`text-[13px] ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-dark w-full">
        {pending ? "Saving…" : "Save details"}
      </button>
      <p className="text-[12px] text-muted">These details fill in automatically at checkout.</p>
    </form>
  );
}
