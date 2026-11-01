import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Demo | Portfolio Pro",
  description: "Schedule a live 1-on-1 walkthrough of the Portfolio Pro white-label wealth management platform.",
};

export default function BookDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
