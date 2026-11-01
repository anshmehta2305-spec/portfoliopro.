import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Portfolio Pro",
  description: "Privacy policy and client data protection commitments for Portfolio Pro platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <div className="bg-navy text-white py-12 border-b border-gold text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Privacy Policy & Data Security</h1>
        <p className="text-xs text-gray-300 mt-2">Last Updated: October 30, 2026</p>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded border border-rule text-xs text-charcoal space-y-6 leading-relaxed font-sans">
          {/* Lawyer Review Required Notice */}
          <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded text-amber-950 font-sans">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 px-1.5 py-0.5 rounded mr-2">
              Counsel Review Draft
            </span>
            <strong>Notice:</strong> This document is a preliminary regulatory compliance template. It must be formally reviewed and finalized by your designated legal and compliance counsel prior to live commercial operations under SEBI/AMFI regulations.
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">1. Our Commitment to Distributor Data Confidentiality</h3>
            <p>
              At Portfolio Pro Technologies Private Limited, we hold the privacy and integrity of your
              advisory practice in the highest regard. We operate strictly as an infrastructure SaaS
              provider. We do not sell, rent, monetize, or market to your investors.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">2. Information We Ingest</h3>
            <p>
              To provide portfolio accounting, capital gains calculations, and BSE/NSE transaction
              execution, our platform processes investor folios, PAN numbers, CAS mailback records, and
              bank mandate references strictly on behalf of the registered distributor.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">3. Storage & Encryption Standards</h3>
            <p>
              All financial records are encrypted using AES 256-bit encryption at rest and TLS 1.3 in
              transit. Data centers are physically located in Mumbai, India, in compliance with SEBI and
              RBI data localization regulations.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">4. Contact Data Protection Officer</h3>
            <p>
              For privacy compliance or data export queries, reach our Data Protection Officer at:{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-brand-blue font-bold">
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

