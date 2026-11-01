import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Portfolio Pro",
  description: "Reset your Portfolio Pro portal access credentials.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

