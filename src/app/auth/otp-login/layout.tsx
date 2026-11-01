import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Login | Portfolio Pro",
  description: "Secure one-time password login via registered Indian mobile number.",
};

export default function OtpLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

