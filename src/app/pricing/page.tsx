"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, Shield, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { pricingPlans, pricingComparison } from "@/config/pricing";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Transparent Subscription Economics
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Predictable Software Pricing. Zero AUM Cuts.
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Unlike aggregators who take a percentage of your trail commission, Portfolio Pro is 100%
            software-as-a-service. 100% of your brokerage revenues remain in your hands.
          </p>

          {/* Monthly / Yearly Billing Switcher */}
          <div className="pt-6 inline-flex items-center gap-3 bg-navy-light p-1.5 rounded-full border border-gold/40">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                !isYearly ? "bg-gold text-navy shadow-classic" : "text-gray-300 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isYearly ? "bg-gold text-navy shadow-classic" : "text-gray-300 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                Save ~17%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <Section background="ivory" withOrnament>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const periodLabel = isYearly ? "/ year (billed annually)" : "/ month";

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-[4px] p-8 border flex flex-col justify-between shadow-card transition-all ${
                  plan.isPopular
                    ? "border-2 border-gold shadow-classic-lg scale-[1.02] bg-white z-10"
                    : "border-rule/80 hover:border-gold/60"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-navy font-bold text-[11px] uppercase tracking-wider px-4 py-1 rounded-full shadow-classic flex items-center gap-1 border border-navy">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular for Growing MFDs</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-navy">{plan.name}</h3>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{plan.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-rule/60">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl font-bold text-navy">
                        {formatINR(price)}
                      </span>
                      <span className="text-xs text-charcoal-muted">{periodLabel}</span>
                    </div>
                    <div className="text-[11px] text-brand-blue font-semibold mt-1">
                      {plan.idealFor}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-rule/60">
                    <span className="text-xs font-bold text-navy uppercase tracking-wider block mb-3">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2.5 text-xs text-charcoal">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    variant={plan.isPopular ? "gold" : "navy"}
                    size="lg"
                    fullWidth
                    href="/book-demo"
                  >
                    {plan.ctaText}
                  </Button>
                  <p className="text-[11px] text-gray-500 text-center mt-2">
                    14-Day Full Access Trial • No Credit Card Required
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Feature Comparison Table */}
      <Section background="white" withOrnament>
        <Heading
          badge="In-Depth Matrix"
          title="Comprehensive Feature Comparison by Plan"
          subtitle="Compare specifications across client capacity, exchange execution rails, reporting, and support."
          align="center"
        />

        <div className="overflow-x-auto border border-rule rounded-[3px] shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-navy text-white font-serif">
                <th className="p-4 w-2/5">Capability / Module</th>
                <th className="p-4 w-1/5 text-center">Starter MFD</th>
                <th className="p-4 w-1/5 text-center text-gold">Professional (Popular)</th>
                <th className="p-4 w-1/5 text-center">Enterprise Desk</th>
              </tr>
            </thead>
            <tbody>
              {pricingComparison.map((cat, idx) => (
                <React.Fragment key={idx}>
                  <tr className="bg-ivory border-y border-rule font-serif font-bold text-navy">
                    <td colSpan={4} className="p-3 text-xs uppercase tracking-wider text-navy">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.features.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-rule/60 hover:bg-ivory/50 transition-colors"
                    >
                      <td className="p-3.5 font-medium text-charcoal">{row.name}</td>
                      <td className="p-3.5 text-center">{renderCellValue(row.starter)}</td>
                      <td className="p-3.5 text-center bg-gold/5 font-semibold">
                        {renderCellValue(row.professional)}
                      </td>
                      <td className="p-3.5 text-center font-semibold">
                        {renderCellValue(row.enterprise)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function renderCellValue(val: boolean | string) {
  if (typeof val === "boolean") {
    return val ? (
      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
    ) : (
      <X className="w-4 h-4 text-gray-400 mx-auto" />
    );
  }
  return <span className="text-navy">{val}</span>;
}

