import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PhoneMockup } from "@/components/home/PhoneMockup";
import { siteConfig } from "@/config/site";
import { CheckCircle2, Shield, Smartphone, Lock, TrendingUp, Sparkles, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "White-Label Investor Mobile App & Web Portal",
  description:
    "Give your clients a bank-grade mobile app branded with your firm's name and logo. Biometric login, one-click SIP approval, and consolidated family portfolio tracking.",
};

export default function InvestorAppPage() {
  return (
    <div>
      {/* Header Banner */}
      <div className="bg-navy text-white py-16 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Client-Facing Technology
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            White-Label Investor Mobile App & Web Portal
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Published directly on the Google Play Store and Apple App Store under your advisory
            firm&apos;s developer account with your custom icon and splash screen.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="gold" href="/book-demo">
              Schedule Interactive App Demo
            </Button>
            <Button variant="secondary" href="/pricing" className="text-white border-gold hover:bg-gold/10">
              Check Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Main Feature Showcase Grid */}
      <Section background="ivory" withOrnament>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Phone Mockup (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <PhoneMockup appType="investor" appName={siteConfig.name} />
          </div>

          {/* Right: Detailed Capabilities (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                Transform How Clients Experience Their Wealth
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                Modern retail and HNI investors demand real-time visibility, instant execution, and
                uncompromised security. Give them a private banking standard app that builds lasting
                institutional loyalty.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-charcoal">
              {[
                {
                  title: "Biometric & OTP Access",
                  desc: "Instant FaceID and fingerprint recognition for frictionless daily portfolio checking.",
                },
                {
                  title: "Family Portfolio Consolidation",
                  desc: "Toggle between individual PANs and consolidated family wealth views with one tap.",
                },
                {
                  title: "One-Click SIP Approval",
                  desc: "Approve transaction recommendations instantly via UPI AutoPay or NetBanking e-Mandates.",
                },
                {
                  title: "Milestone Goal GPS",
                  desc: "Visual progress tracking towards retirement, child higher education, and luxury goals.",
                },
                {
                  title: "Online ATM Liquidity",
                  desc: "Earn better returns on idle bank balances with 24/7 instant liquid fund redemptions.",
                },
                {
                  title: "Capital Gains Tax Dossier",
                  desc: "Download audited 12.5% LTCG and 20% STCG statements formatted for income tax returns.",
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

            {/* App Store Placeholders */}
            <div className="pt-4 border-t border-rule space-y-3">
              <span className="text-xs font-bold text-navy uppercase tracking-wider block">
                Available on Mobile Platforms:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2.5 bg-navy text-white rounded-[4px] border border-gold/40 shadow-sm cursor-pointer hover:border-gold transition-colors">
                  <Smartphone className="w-6 h-6 text-gold" />
                  <div className="text-left text-xs leading-tight">
                    <div className="text-[10px] text-gray-400">Available on</div>
                    <div className="font-bold">Google Play Store</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 bg-navy text-white rounded-[4px] border border-gold/40 shadow-sm cursor-pointer hover:border-gold transition-colors">
                  <Smartphone className="w-6 h-6 text-gold" />
                  <div className="text-left text-xs leading-tight">
                    <div className="text-[10px] text-gray-400">Download on the</div>
                    <div className="font-bold">Apple App Store</div>
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

