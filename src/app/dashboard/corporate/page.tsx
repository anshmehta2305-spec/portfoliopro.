import React from "react";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Building, TrendingUp, Users, FileSpreadsheet, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Desk | Portfolio Pro",
};

export default function CorporateDashboardPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="Corporate (ARN)"
        userName="Apex Capital Advisors Pvt Ltd"
        subTitle="ARN-90214 | Multi-Entity Group Desk"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Consolidated Corporate AUM
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">₹312.8 Cr</div>
            <div className="text-[11px] text-gray-500 mt-1">Across 14 Associate Branches</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Monthly Inflow Run-Rate
            </span>
            <div className="text-2xl font-serif font-bold text-brand-blue mt-1">₹1.85 Cr</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">+14% YoY Growth</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Sub-Broker Entities
            </span>
            <div className="text-2xl font-serif font-bold text-gold-dark mt-1">28 Partners</div>
            <div className="text-[11px] text-gray-500 mt-1">Franchise distribution network</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Entity Compliance
            </span>
            <div className="text-xl font-serif font-bold text-emerald-800 mt-1">Compliant</div>
            <div className="text-[11px] text-gray-500 mt-1">AMFI & SEBI Reporting Up-to-date</div>
          </Card>
        </div>

        <div className="bg-white p-6 rounded border border-rule shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-navy border-b border-rule pb-3">
            Branch & Regional Entity Allocation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-ivory rounded border border-rule space-y-2">
              <div className="font-bold text-navy text-sm">Western Zone (Mumbai & Pune)</div>
              <div className="text-gray-600">AUM: ₹164.2 Cr • 18 RMs</div>
            </div>
            <div className="p-4 bg-ivory rounded border border-rule space-y-2">
              <div className="font-bold text-navy text-sm">Northern Zone (Delhi NCR)</div>
              <div className="text-gray-600">AUM: ₹98.4 Cr • 12 RMs</div>
            </div>
            <div className="p-4 bg-ivory rounded border border-rule space-y-2">
              <div className="font-bold text-navy text-sm">Southern Zone (Bengaluru)</div>
              <div className="text-gray-600">AUM: ₹50.2 Cr • 6 RMs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

