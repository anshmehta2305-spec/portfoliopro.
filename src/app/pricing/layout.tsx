import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Portfolio Pro",
  description: "Transparent flat subscription pricing for independent MFDs, advisory partnerships, and multi-branch enterprises.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
