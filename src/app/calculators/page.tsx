import React, { Suspense } from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { CalculatorsContainer } from "@/components/calculators/CalculatorsContainer";
import { Calculator, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "10 Interactive Financial & MFD Calculators | SIP, SWP, Tax, Trail",
  description:
    "Institutional financial calculators: SIP, Lumpsum, Step-up SIP, SWP, Goal GPS, Retirement, Education, Inflation, MFD Trail Brokerage, and 12.5% LTCG/STCG Tax.",
};

export default function CalculatorsPage() {
  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-gold" />
            <span>Institutional Computational Engine</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Interactive Financial & Advisory Calculators
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Mathematically precise financial calculators for wealth advisors and investors. Visualise
            compounding trajectories, print formatted client proposals, and audit tax liabilities.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <Suspense fallback={<div className="text-center p-12 text-sm text-gray-500">Loading calculators...</div>}>
          <CalculatorsContainer />
        </Suspense>
      </Section>
    </div>
  );
}

