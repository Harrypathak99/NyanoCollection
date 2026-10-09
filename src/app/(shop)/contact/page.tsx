import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { PageHeader } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" crumbs={[{ label: "Contact us" }]} />
      <section className="container-page grid gap-12 py-16 md:grid-cols-[1fr_1.4fr] lg:py-20">
        <div>
          <h2 className="mb-4 text-[26px]">We&apos;d love to hear from you</h2>
          <p className="mb-8 leading-relaxed text-body">
            Questions about an order, a custom gift set or a wholesale enquiry? Send us a message and we&apos;ll reply within one working day.
          </p>
          <dl className="space-y-5 text-[14px]">
            <div>
              <dt className="mb-1 font-medium">Phone</dt>
              <dd className="text-body">{SITE.phone}</dd>
            </div>
            <div>
              <dt className="mb-1 font-medium">Email</dt>
              <dd className="text-body">{SITE.email}</dd>
            </div>
            <div>
              <dt className="mb-1 font-medium">Studio</dt>
              <dd className="text-body">{SITE.address}</dd>
            </div>
            <div>
              <dt className="mb-1 font-medium">Hours</dt>
              <dd className="text-body">Sunday – Friday, 10am – 6pm</dd>
            </div>
          </dl>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
