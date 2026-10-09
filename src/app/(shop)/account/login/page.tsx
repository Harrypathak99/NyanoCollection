import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <>
      <PageHeader title="Log in" crumbs={[{ label: "Account", href: "/account" }, { label: "Log in" }]} />
      <section className="container-page max-w-md py-14">
        {/* The form reads ?next from the URL, which isn't known until request time. */}
        <Suspense fallback={<LoginForm next="/account" />}>
          <LoginForm next={null} />
        </Suspense>
      </section>
    </>
  );
}
