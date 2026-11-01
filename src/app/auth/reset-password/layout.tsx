import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Portfolio Pro",
  description: "Set a new secure password for your account.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

