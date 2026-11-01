import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Portfolio Pro",
  description: "Secure role-based portal login for investors, distributors, and administrators.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

