import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { featuresList } from "@/config/features";
import { CheckCircle2, Shield, ArrowRight, Zap, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Features | Portfolio Pro",
  description:
    "Explore the complete feature architecture of Portfolio Pro: Video KYC, BSE StarMF & NSE NMF routing, Multi-asset reporting, CAS auto-sync, and Robo-advisory rebalancing.",
};

export default function FeaturesPage() {
  return (
    <div>
      {/* Top Header Banner */}
      <div className="bg-navy text-white py-16 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Full Platform Specifications
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            The Modern Operating System for Indian MFDs
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate operational friction, automate order execution, and give your investors an
            institutional private banking experience under your brand.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="gold" href="/book-demo">
              Schedule Architecture Demo
            </Button>
            <Button variant="secondary" href="/pricing" className="text-white border-gold hover:bg-gold/10">
              View Pricing Tiers
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed 12 Feature Deep-Dive Modules */}
      <Section background="ivory">
        <div className="space-y-16">
          {featuresList.map((f, idx) => (
            <div
              key={f.id}
              id={f.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Feature Text Info (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-gold/15 text-gold-dark border border-gold/40">
                    {f.badge}
                  </span>
                  <span className="text-xs text-charcoal-muted">Module #{idx + 1}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                  {f.title}
                </h2>

                <p className="text-sm text-charcoal leading-relaxed font-sans font-medium">
                  {f.shortDesc}
                </p>

                <p className="text-xs text-charcoal-muted leading-relaxed">
                  {f.detailedDesc}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy mb-2.5">
                    Core Architectural Capabilities:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal">
                    {f.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded border border-rule/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature Visual Card (5 cols) */}
              <div className="lg:col-span-5">
                <Card className="bg-white border-2 border-rule/80 p-6 space-y-4 shadow-classic">
                  <div className="flex items-center justify-between border-b border-rule pb-3">
                    <span className="font-serif font-bold text-navy text-sm">
                      {f.title} Summary
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-2 text-xs text-charcoal-muted">
                    <p>
                      ✓ <strong>Compliance:</strong> Built to fully adhere to SEBI & AMFI master circulars.
                    </p>
                    <p>
                      ✓ <strong>Deployment:</strong> Available on Web, Android, iOS and API Webhooks.
                    </p>
                    <p>
                      ✓ <strong>White-Label:</strong> Dynamic branding matches your custom palette.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-rule flex justify-between items-center text-xs">
                    <span className="font-semibold text-navy">Included in all plans</span>
                    <Link
                      href="/book-demo"
                      className="font-bold text-brand-blue hover:text-navy inline-flex items-center gap-1"
                    >
                      <span>Request Walkthrough</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

