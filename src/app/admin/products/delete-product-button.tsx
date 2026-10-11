"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteProductById } from "../actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !pending && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteProductById(id);
      if (result?.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(result?.message ?? "Could not delete the product.");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label={`Delete ${name}`}
        title="Delete"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <TrashIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !pending && setOpen(false)} />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${id}`}
            className="relative w-full max-w-sm rounded-md bg-white p-6 shadow-xl"
          >
            <h2 id={`delete-title-${id}`} className="mb-2 text-[20px]">
              Delete product?
            </h2>
            <p className="mb-6 text-[14px] leading-relaxed text-body">
              <strong className="font-medium text-ink">{name}</strong> and its photos will be permanently removed from the
              store. Past orders keep their copy of this product.
            </p>
            {error && (
              <p role="alert" className="mb-4 rounded bg-red-50 px-3 py-2 text-[13px] text-red-700">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="rounded-full border border-line px-5 py-2 text-[12px] font-semibold uppercase tracking-wider text-ink hover:border-ink disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={confirmDelete}
                className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-80"
              >
                {pending && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" />
    </svg>
  );
}
