import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Distributor Panel | Portfolio Pro",
  description: "Enterprise administration and distributor operations console.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

