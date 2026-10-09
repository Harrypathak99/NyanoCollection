import type { Metadata } from "next";
import { TrackForm } from "./track-form";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackOrderPage() {
  return (
    <>
      <PageHeader title="Track your order" crumbs={[{ label: "Track order" }]}>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-body">
          Enter the order number from your confirmation and the phone number you used at checkout.
        </p>
      </PageHeader>
      <TrackForm />
    </>
  );
}
