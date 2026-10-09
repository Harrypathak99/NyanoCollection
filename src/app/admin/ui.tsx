import type { ReactNode } from "react";

export function AdminTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-[28px]">{title}</h1>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-md border border-line bg-white p-5 ${className}`}>{children}</div>;
}

export function AdminSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-9 w-48 rounded bg-line" />
      <div className="h-64 rounded bg-white" />
    </div>
  );
}

export const th = "px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted";
export const td = "px-4 py-3 text-[14px]";
