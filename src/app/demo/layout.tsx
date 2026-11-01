import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Showcase | Portfolio Pro",
  description: "Private distributor presentation portal for interactive product walk-throughs.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

