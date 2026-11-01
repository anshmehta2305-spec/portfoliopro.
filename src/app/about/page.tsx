import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { ShieldCheck, Award, Users, Building, Target, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Portfolio Pro",
  description:
    "Learn about Portfolio Pro, our mission to empower independent financial distributors with institutional-grade technology, and our leadership principles.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Our Heritage & Mission
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Building India&apos;s Most Trusted Wealth Operating System
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Founded with a singular conviction: independent financial advisors are the backbone of
            India&apos;s capital markets, and they deserve technology equal to the largest global private
            banks.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="space-y-3">
              <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy">Our Mission</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                To equip 50,000+ mutual fund distributors across Tier-1, Tier-2, and Tier-3 Indian
                cities with white-labeled digital infrastructure that elevates investor trust,
                eliminates manual reconciliation errors, and accelerates AUM compounding.
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy">Our Core Principle</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                We are strictly a software partner, never a distributor competitor. We do not solicit
                your investors, nor do we take a percentage of your hard-earned trail brokerage. Your
                client data is 100% confidential and owned exclusively by you.
              </p>
            </Card>
          </div>

          {/* Institutional Values */}
          <div className="bg-white p-8 rounded border border-rule space-y-6">
            <h3 className="font-serif text-2xl font-bold text-navy text-center">
              The Pillars of Portfolio Pro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-2 p-4 bg-ivory rounded border border-rule">
                <div className="font-bold text-navy font-serif text-sm">Airtight Security</div>
                <p className="text-gray-600">
                  ISO 27001 empanelled data protocols, TLS 1.3 encryption, and SEBI circular-aligned
                  audit trails.
                </p>
              </div>
              <div className="space-y-2 p-4 bg-ivory rounded border border-rule">
                <div className="font-bold text-navy font-serif text-sm">Relentless Uptime</div>
                <p className="text-gray-600">
                  Dual-redundant order gateways switching smoothly between BSE StarMF and NSE NMF II.
                </p>
              </div>
              <div className="space-y-2 p-4 bg-ivory rounded border border-rule">
                <div className="font-bold text-navy font-serif text-sm">Distributor-First Support</div>
                <p className="text-gray-600">
                  Dedicated Relationship Managers who understand CAMS mailbacks, Karvy folios, and
                  e-Mandates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

