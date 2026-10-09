import type { Metadata } from "next";
import { RegisterForm } from "./register-form";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <>
      <PageHeader title="Create account" crumbs={[{ label: "Account", href: "/account" }, { label: "Register" }]} />
      <section className="container-page max-w-md py-14">
        <RegisterForm />
      </section>
    </>
  );
}
