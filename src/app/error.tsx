"use client";

import React, { useEffect } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <Section background="ivory" className="min-h-[70vh] flex items-center justify-center text-center">
      <div className="max-w-md mx-auto space-y-4">
        <span className="font-serif text-5xl font-bold text-red-700">Error</span>
        <h2 className="font-serif text-2xl font-bold text-navy">Application Exception Encountered</h2>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          An unexpected error occurred while executing this financial operation. Our engineering
          telemetry desk has recorded the event.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="navy" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="secondary" href="/">
            Go to Homepage
          </Button>
        </div>
      </div>
    </Section>
  );
}

