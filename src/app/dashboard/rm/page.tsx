import React from "react";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Users, Calendar, PhoneCall, CheckCircle2, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Relationship Manager (RM) Console | Portfolio Pro",
};

export default function RmDashboardPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="Relationship Manager"
        userName="Amitav Deshmukh"
        subTitle="Senior Wealth RM | Assigned Portfolio Desk"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Assigned Book AUM
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">₹16.20 Cr</div>
            <div className="text-[11px] text-gray-500 mt-1">92 HNI Family Portfolios</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Today&apos;s Client Reviews
            </span>
            <div className="text-2xl font-serif font-bold text-brand-blue mt-1">4 Meetings</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">2 Portfolios Rebalanced</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Monthly Top-Up Achieved
            </span>
            <div className="text-2xl font-serif font-bold text-gold-dark mt-1">₹42.5 Lakhs</div>
            <div className="text-[11px] text-gray-500 mt-1">Target: ₹35.0 Lakhs (121%)</div>
          </Card>
        </div>

        <div className="bg-white p-6 rounded border border-rule shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-navy border-b border-rule pb-3">
            Today&apos;s Client Review Schedule & Notes
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-ivory rounded border border-rule flex justify-between items-center">
              <div>
                <span className="font-bold text-navy">Dr. Anand Kothari (11:00 AM)</span>
                <div className="text-[10px] text-gray-500">
                  Agenda: FY27 Retirement Corpus Goal GPS review & step-up SIP recommendation
                </div>
              </div>
              <span className="text-[11px] font-semibold text-brand-blue bg-blue-50 px-2 py-0.5 rounded">
                Completed
              </span>
            </div>
            <div className="p-3 bg-ivory rounded border border-rule flex justify-between items-center">
              <div>
                <span className="font-bold text-navy">Meera Nambiar (03:30 PM)</span>
                <div className="text-[10px] text-gray-500">
                  Agenda: Capital gains tax review (12.5% LTCG) & ELSS reallocation
                </div>
              </div>
              <span className="text-[11px] font-semibold text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

