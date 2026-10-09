import { Suspense } from "react";
import { AdminSkeleton, AdminTitle, Card } from "../ui";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatDateTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Messages />
    </Suspense>
  );
}

async function Messages() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: messages }, { data: subscribers }] = await Promise.all([
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <AdminTitle title="Messages" />
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-3 text-[20px]">Contact form</h2>
          <div className="space-y-3">
            {(messages ?? []).map((m) => (
              <Card key={m.id}>
                <div className="mb-2 flex flex-wrap justify-between gap-2 text-[13px]">
                  <span>
                    <strong className="font-medium">{m.name}</strong> ·{" "}
                    <a href={`mailto:${m.email}`} className="underline hover:text-accent">
                      {m.email}
                    </a>
                  </span>
                  <span className="text-muted">{formatDateTime(m.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap text-[14px] text-body">{m.message}</p>
              </Card>
            ))}
            {(messages ?? []).length === 0 && <Card className="text-[14px] text-muted">No messages yet.</Card>}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-[20px]">Newsletter ({(subscribers ?? []).length})</h2>
          <Card>
            {(subscribers ?? []).length === 0 ? (
              <p className="text-[14px] text-muted">No subscribers yet.</p>
            ) : (
              <ul className="divide-y divide-line text-[14px]">
                {(subscribers ?? []).map((s) => (
                  <li key={s.id} className="flex justify-between gap-2 py-2">
                    <span className="truncate">{s.email}</span>
                    <span className="shrink-0 text-muted">{formatDate(s.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </>
  );
}
