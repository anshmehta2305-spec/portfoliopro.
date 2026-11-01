import React from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section background="ivory" className="min-h-[70vh] flex items-center justify-center text-center">
      <div className="max-w-md mx-auto space-y-4">
        <span className="font-serif text-6xl font-bold text-gold">404</span>
        <h2 className="font-serif text-2xl font-bold text-navy">Page Not Found</h2>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          The requested advisory page or financial report does not exist or has been relocated to
          another directory.
        </p>
        <div className="pt-2">
          <Button variant="navy" href="/">
            Return to Homepage
          </Button>
        </div>
      </div>
    </Section>
  );
}

