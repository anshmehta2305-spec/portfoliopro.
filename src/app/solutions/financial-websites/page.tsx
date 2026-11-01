import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Globe, CheckCircle2, ShieldCheck, Sparkles, Layout, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "AMFI-Compliant Financial Websites for Mutual Fund Distributors",
  description:
    "Launch a high-converting, mobile-responsive financial advisory website complete with SIP calculators, live AMFI NAV fund feeds, lead capture forms, and client login.",
};

export default function FinancialWebsitesPage() {
  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Digital Advisory Web Presence
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            AMFI-Compliant Financial Websites for MFDs
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Establish institutional authority in your local market. Complete with interactive SIP
            calculators, AMFI NAV feeds, investor login portal, and automated lead capture.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="gold" href="/book-demo">
              Request Website Demo
            </Button>
            <Button variant="secondary" href="/pricing" className="text-white border-gold hover:bg-gold/10">
              Explore Website Plans
            </Button>
          </div>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <Heading
          badge="Turnkey Solution"
          title="Everything Required to Dominate Your Local Advisory Market"
          subtitle="Stop relying on outdated single-page static sites. Get a modern, high-speed portal engineered for client conversion."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Interactive Calculators",
              desc: "Embedded SIP, Goal, Retirement, and Tax calculators that allow website visitors to estimate wealth trajectories and submit their contact details.",
            },
            {
              title: "Live AMFI NAV & Fund Explorer",
              desc: "Daily automated NAV updates across HDFC, ICICI, SBI, Nippon, and Mirae Asset funds with risk meters and performance charts.",
            },
            {
              title: "Custom Domain & Zero-Cost SSL",
              desc: "Host on your own firm's domain (e.g. www.sharmawealth.com) with automated SSL encryption and 99.99% uptime guarantee.",
            },
            {
              title: "Embedded Investor Portal Login",
              desc: "Direct login doorway on your website header allowing your clients to access their white-labeled portfolios securely.",
            },
            {
              title: "AMFI Compliance & Disclaimers",
              desc: "Pre-configured with statutory AMFI registration disclaimers, EUIN codes, and SEBI-mandated risk notices to keep you 100% compliant.",
            },
            {
              title: "Local SEO & Google Maps Ready",
              desc: "Optimized for local Google search queries (e.g. 'Top Mutual Fund Advisor in Pune') with Schema.org markup.",
            },
          ].map((item, idx) => (
            <Card key={idx} hoverEffect className="space-y-3">
              <div className="w-9 h-9 rounded bg-navy text-gold flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-navy">{item.title}</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

