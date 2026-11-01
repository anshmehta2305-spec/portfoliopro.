import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Portfolio Pro",
  description: "Create your investor or distributor account on Portfolio Pro.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
