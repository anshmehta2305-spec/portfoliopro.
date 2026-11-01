import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { FundDetailClient } from "./FundDetailClient";
import { ArrowLeft, ShieldCheck, Award, TrendingUp, Layers, CheckCircle } from "lucide-react";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fund = await db.fund.findUnique({ where: { id: params.id } });
  if (!fund) {
    return { title: "Fund Not Found | Portfolio Pro" };
  }
  const cleanName = fund.name.length > 40 ? fund.name.slice(0, 37) + "..." : fund.name;
  return {
    title: `${cleanName} | Portfolio Pro`,
    description: `Inspect latest NAV, performance returns, and fund facts for ${fund.name}.`,
  };
}

export default async function FundDetailPage({ params }: Props) {
  const fund = await db.fund.findUnique({
    where: { id: params.id },
    include: {
      navHistory: { take: 30, orderBy: { createdAt: "desc" } },
    },
  });

  if (!fund) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top Banner */}
      <div className="bg-navy text-white py-10 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/fund-explorer"
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Scheme Explorer
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-navy-light text-gold text-[10px] font-bold uppercase rounded border border-gold/40">
                  {fund.category}
                </span>
                <span className="text-xs text-gray-400">AMFI Code: {fund.amfiCode}</span>
                <span className="text-xs text-gray-400">• AMC: {fund.amc}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {fund.name}
              </h1>
            </div>

            <div className="bg-navy-dark p-4 rounded border border-gold/40 text-right">
              <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Current NAV ({fund.navDate})
              </div>
              <div className="font-serif text-3xl font-bold text-gold">
                ₹{fund.nav.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Section background="ivory">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Scheme Metrics & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
                <div className="text-[10px] uppercase font-bold text-charcoal-muted">1Y Return</div>
                <div className="text-xl font-serif font-bold text-emerald-700 mt-1">
                  +{fund.oneYearReturn}%
                </div>
              </Card>

              <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
                <div className="text-[10px] uppercase font-bold text-charcoal-muted">3Y CAGR</div>
                <div className="text-xl font-serif font-bold text-emerald-700 mt-1">
                  +{fund.threeYearReturn}%
                </div>
              </Card>

              <Card className="p-4 bg-white border-l-4 border-l-emerald-600">
                <div className="text-[10px] uppercase font-bold text-charcoal-muted">5Y CAGR</div>
                <div className="text-xl font-serif font-bold text-emerald-700 mt-1">
                  +{fund.fiveYearReturn}%
                </div>
              </Card>

              <Card className="p-4 bg-white border-l-4 border-l-navy">
                <div className="text-[10px] uppercase font-bold text-charcoal-muted">Expense Ratio</div>
                <div className="text-xl font-serif font-bold text-navy mt-1">
                  {fund.expenseRatio}%
                </div>
              </Card>
            </div>

            {/* Fund Overview Card */}
            <Card className="p-6 bg-white space-y-4">
              <h2 className="font-serif text-lg font-bold text-navy border-b border-rule pb-2">
                Fund Profile & Statutory Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-charcoal-muted block">Asset Management Company:</span>
                  <span className="font-semibold text-charcoal">{fund.amc}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Total Scheme AUM:</span>
                  <span className="font-semibold text-charcoal">₹{fund.aumCrores.toLocaleString("en-IN")} Crores</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">SEBI Scheme Classification:</span>
                  <span className="font-semibold text-charcoal">{fund.category} Equity Scheme</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">SEBI Riskometer:</span>
                  <span className="font-bold text-red-700 uppercase">{fund.riskLevel}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Benchmark Index:</span>
                  <span className="font-semibold text-charcoal">NIFTY 50 TRI</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block">Exit Load:</span>
                  <span className="font-semibold text-charcoal">1% if redeemed within 365 days; Nil thereafter</span>
                </div>
              </div>
            </Card>

            {/* SEBI Statutory Disclaimer */}
            <div className="p-4 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Mutual Fund investments are subject to market risks.</strong> Please read all scheme-related documents carefully before investing. Past performance is not an indicator of future returns.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Transact Card (5 cols) */}
          <div className="lg:col-span-5">
            <FundDetailClient fund={fund} />
          </div>
        </div>
      </Section>
    </div>
  );
}

