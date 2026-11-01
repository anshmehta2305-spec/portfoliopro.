import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Mutual Funds | Portfolio Pro",
  description: "Browse and compare top-performing equity, debt, and hybrid mutual funds with daily AMFI NAV data.",
};

export default function FundExplorerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
