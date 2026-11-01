import React from "react";
import { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bot, Sparkles, TrendingUp, Sliders, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Robo Advisory & Model Portfolio Rebalancing Engine",
  description:
    "Algorithmic model portfolios, automatic asset allocation drift alerts, and one-click rebalancing for mutual fund distributors.",
};

export default function RoboAdvisoryPage() {
  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider">
            Algorithmic Asset Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Robo Advisory & Portfolio Rebalancing Engine
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Construct proprietary Model Portfolios, detect asset allocation drift automatically, and
            execute disciplined rebalancing across client accounts with zero emotional bias.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="gold" href="/book-demo">
              Experience Robo Advisory
            </Button>
            <Button variant="secondary" href="/calculators" className="text-white border-gold hover:bg-gold/10">
              Try Financial Calculators
            </Button>
          </div>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <Heading
          badge="Scientific Framework"
          title="Automate Systematic Portfolio Hygiene"
          subtitle="How our algorithmic rebalancing engine preserves client gains during bull runs and protects capital during market corrections."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="space-y-4">
            <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-navy">Curated Model Portfolios</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Design house-curated portfolios (e.g. &ldquo;HNI Wealth Compounder&rdquo; or &ldquo;Conservative
              Retirement Income&rdquo;) combining Equity, Hybrid, and Liquid funds with predefined asset
              weights.
            </p>
            <ul className="text-xs text-charcoal space-y-1.5 pt-2 border-t border-rule">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Multi-cap equity allocation bands</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Dynamic debt & gold hedges</span>
              </li>
            </ul>
          </Card>

          <Card className="space-y-4">
            <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-navy">Automatic Drift Detection</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              When a surging equity market pushes a client&apos;s equity allocation from 65% to 75% (exceeding
              their target band by +5%), the system flags the drift and generates rebalancing
              recommendations.
            </p>
            <ul className="text-xs text-charcoal space-y-1.5 pt-2 border-t border-rule">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Automated weekly drift scans</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Threshold breach push alerts</span>
              </li>
            </ul>
          </Card>

          <Card className="space-y-4">
            <div className="w-10 h-10 rounded bg-navy text-gold flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-navy">Tax-Smart Order Batching</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              The engine prioritizes folios eligible for long-term capital gains (&gt;12 months) and
              avoids schemes subject to exit loads. Orders route directly to BSE StarMF or NSE NMF II.
            </p>
            <ul className="text-xs text-charcoal space-y-1.5 pt-2 border-t border-rule">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>FIFO redemption optimization</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Instant client WhatsApp approval links</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Model Portfolios Visual Comparison */}
        <div className="mt-16 bg-white p-8 rounded border border-rule space-y-6">
          <div className="border-b border-rule pb-4 text-center">
            <h3 className="font-serif text-2xl font-bold text-navy">
              Standard Model Portfolio Asset Allocation Profiles
            </h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Fully customizable according to your advisory firm&apos;s investment committee guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-5 bg-ivory rounded border border-rule space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-navy bg-white px-2.5 py-1 rounded border border-rule">
                Conservative Shield
              </span>
              <div className="text-2xl font-bold font-serif text-navy">20% Equity • 80% Debt</div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Prioritizes capital protection and regular monthly SWP cashflows. Ideal for retirees
                and short-horizon milestones.
              </p>
            </div>

            <div className="p-5 bg-navy text-white rounded border border-gold space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gold bg-navy-light px-2.5 py-1 rounded border border-gold/40">
                Balanced Growth
              </span>
              <div className="text-2xl font-bold font-serif text-white">60% Equity • 40% Debt</div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Dynamic asset allocation capturing market upside while hedging against sharp drawdowns
                via quality fixed income instruments.
              </p>
            </div>

            <div className="p-5 bg-ivory rounded border border-rule space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-navy bg-white px-2.5 py-1 rounded border border-rule">
                Aggressive Alpha
              </span>
              <div className="text-2xl font-bold font-serif text-navy">85% Equity • 15% Arbitrage</div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Focused on compounding long-term wealth across Midcap and Smallcap mutual fund
                strategies with 10+ year horizons.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

