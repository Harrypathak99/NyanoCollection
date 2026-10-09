import type { Metadata } from "next";
import { CompareView } from "./compare-view";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Compare products" };

export default function ComparePage() {
  return (
    <>
      <PageHeader title="Product compare" crumbs={[{ label: "Compare" }]} />
      <CompareView />
    </>
  );
}
