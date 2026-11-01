import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | Portfolio Pro",
  description: "Terms and conditions of subscription for Portfolio Pro wealth tech platform.",
};

export default function TermsPage() {
  return (
    <div>
      <div className="bg-navy text-white py-12 border-b border-gold text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Terms of Service</h1>
        <p className="text-xs text-gray-300 mt-2">Effective as of October 2026</p>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded border border-rule text-xs text-charcoal space-y-6 leading-relaxed font-sans">
          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">1. Agreement to Terms</h3>
            <p>
              By accessing or subscribing to the Portfolio Pro platform, mobile applications, or APIs,
              you agree to be bound by these terms. If you are registering on behalf of an advisory
              firm or corporate entity, you affirm that you have statutory authority to enter this
              agreement.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">2. AMFI & SEBI Regulatory Compliance</h3>
            <p>
              The subscriber represents that they possess a valid AMFI Registration Number (ARN) or
              SEBI RIA license and adhere strictly to all regulatory guidelines issued by AMFI, SEBI,
              and RBI regarding client disclosures and code of conduct.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">3. Intellectual Property</h3>
            <p>
              Portfolio Pro grants you a revocable, non-exclusive, non-transferable license to use our
              white-labeled platform and mobile applications under your chosen branding for the
              duration of your active paid subscription.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

