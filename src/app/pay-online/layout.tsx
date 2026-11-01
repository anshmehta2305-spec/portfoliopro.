import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay Online | Portfolio Pro",
  description: "Secure 256-bit encrypted online subscription payments for Portfolio Pro white-label platform licenses.",
};

export default function PayOnlineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

