import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Statutory & Regulatory Disclaimer | Portfolio Pro",
  description: "Mandatory market risk disclosures and AMFI regulatory disclaimers.",
};

export default function DisclaimerPage() {
  return (
    <div>
      <div className="bg-navy text-white py-12 border-b border-gold text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Regulatory & Risk Disclaimer</h1>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded border border-rule text-xs text-charcoal space-y-6 leading-relaxed font-sans">
          {/* Lawyer Review Required Notice */}
          <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded text-amber-950 font-sans">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 px-1.5 py-0.5 rounded mr-2">
              Counsel Review Draft
            </span>
            <strong>Regulatory Notice:</strong> This statutory disclaimer template must be reviewed by legal compliance to ensure all applicable SEBI (Investment Advisers / Mutual Fund Distributors) regulations, AMFI circulars, and PMLA disclaimers are fully incorporated.
          </div>
          <div className="p-4 bg-amber-50 border-l-4 border-amber-600 rounded">
            <p className="font-semibold text-amber-900">
              {siteConfig.riskDisclaimer}
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">1. Nature of Platform Services</h3>
            <p>
              Portfolio Pro Technologies Private Limited is a technology provider. The calculations,
              projections, and charts generated on this website and our software are for educational
              and demonstration purposes only and should not be construed as investment or tax advice.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-navy mb-2">2. AMFI Registration Details</h3>
            <p>
              Distributor operations are licensed under AMFI Registration Number {siteConfig.arnNumber}.
              Mutual fund investments are subject to market risks, including the possible loss of
              principal amount invested. Past performance is not an indicator of future returns.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

