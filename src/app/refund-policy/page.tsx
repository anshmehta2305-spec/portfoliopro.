import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Portfolio Pro",
  description: "Subscription cancellation and refund policy for Portfolio Pro.",
};

export default function RefundPolicyPage() {
  return (
    <div>
      <div className="bg-navy text-white py-12 border-b border-gold text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Refund & Cancellation Policy</h1>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded border border-rule text-xs text-charcoal space-y-6 leading-relaxed font-sans">
          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">1. 14-Day Free Evaluation Period</h3>
            <p>
              We provide a comprehensive 14-day full access evaluation period with sample data so you
              can thoroughly test all features, mobile app layouts, and reports before any financial
              commitment.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">2. Subscription Cancellation</h3>
            <p>
              You may cancel your monthly or annual subscription at any time from your admin console.
              Upon cancellation, your access remains active until the end of your current paid billing
              cycle.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">3. Refund Guidelines</h3>
            <p>
              If you experience technical platform unavailability exceeding our 99.9% SLA commitment
              during the first 30 days of an annual license, a pro-rata refund will be issued upon
              request to {siteConfig.email}.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

