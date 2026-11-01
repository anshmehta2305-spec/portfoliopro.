import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Portfolio Pro",
  description: "Connect with our Bharuch wealth-tech advisory desk for platform demos, white-labeling, and distributor partnerships.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

