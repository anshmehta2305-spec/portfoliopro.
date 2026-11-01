import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | Portfolio Pro",
  description: "Read real reviews and success stories from mutual fund distributors and IFAs using Portfolio Pro.",
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

