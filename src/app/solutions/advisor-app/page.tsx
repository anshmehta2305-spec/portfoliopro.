import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PhoneMockup } from "@/components/home/PhoneMockup";
import { siteConfig } from "@/config/site";
import { CheckCircle2, Shield, Smartphone, Coins, BarChart3, Repeat, Users2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Advisor App | Portfolio Pro",
  description:
    "Complete operational control for financial advisors: BSE StarMF transaction gateway, trail commission reconciliation, multi-asset portfolio accounting, and relationship manager supervision.",
};

export default function AdvisorAppPage() {
  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Distributor Operating System
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Advisor Desk & Comprehensive Back-Office
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Manage your entire wealth practice on the go. Supervise AUM, process BSE StarMF and NSE
            NMF transactions, track trail commissions, and manage relationship managers.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="gold" href="/book-demo">
              Book Back-Office Demo
            </Button>
            <Button variant="secondary" href="/features" className="text-white border-gold hover:bg-gold/10">
              View All Features
            </Button>
          </div>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <PhoneMockup appType="advisor" appName={siteConfig.name} />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                Scale Operations without Adding Headcount
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                Advisors spend up to 40% of their day on administrative chores like CAMS mailback
                syncs, folio error matching, and manual client payment reminders. Portfolio Pro
                automates these repetitive tasks so you can focus on building client trust.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-charcoal">
              {[
                {
                  title: "Real-Time AUM & SIP Book",
                  desc: "Live gross inflows, net additions, upcoming SIP due calendar, and bounce tracking.",
                },
                {
                  title: "Bulk Order Execution",
                  desc: "Execute switch, STP, or lumpsum recommendations across hundreds of folios in minutes.",
                },
                {
                  title: "Trail Commission Reconciliation",
                  desc: "Identify clawbacks and rate discrepancies between AMC advice sheets and actual bank credits.",
                },
                {
                  title: "Sub-Broker & RM Splits",
                  desc: "Automate franchisee revenue sharing with granular role-scoped account access.",
                },
                {
                  title: "Zero-Click CAS Ingestion",
                  desc: "Daily automated parsing of CAMS, KFintech, and NSDL transaction files.",
                },
                {
                  title: "Audit & Compliance Vault",
                  desc: "7-year tamper-proof log of every order, login, document view, and advice note.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded border border-rule space-y-1.5 shadow-sm">
                  <h4 className="font-bold text-navy text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-gray-600 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-rule space-y-3">
              <span className="text-xs font-bold text-navy uppercase tracking-wider block">
                Cross-Platform Availability:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2.5 bg-navy text-white rounded-[4px] border border-gold/40 shadow-sm cursor-pointer hover:border-gold transition-colors">
                  <Smartphone className="w-6 h-6 text-gold" />
                  <div className="text-left text-xs leading-tight">
                    <div className="text-[10px] text-gray-400">Available on</div>
                    <div className="font-bold">Android Advisor App</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 bg-navy text-white rounded-[4px] border border-gold/40 shadow-sm cursor-pointer hover:border-gold transition-colors">
                  <Smartphone className="w-6 h-6 text-gold" />
                  <div className="text-left text-xs leading-tight">
                    <div className="text-[10px] text-gray-400">Web Portal</div>
                    <div className="font-bold">Desktop Back-Office</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

