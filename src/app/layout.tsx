import type { Metadata } from "next";
import { Jost, Marcellus } from "next/font/google";
import { StoreProvider } from "@/components/store-provider";
import { SITE } from "@/lib/site";
import "./globals.css";

const marcellus = Marcellus({ variable: "--font-marcellus", subsets: ["latin"], weight: "400" });
const jost = Jost({ variable: "--font-jost", subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${SITE.name} — Hand-poured candles`, template: `%s | ${SITE.name}` },
  description: "Hand-poured soy wax candles in glass, ceramic and pillar styles. Cash on delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${marcellus.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
