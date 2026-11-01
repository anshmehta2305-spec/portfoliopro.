import React from "react";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Coins, Users, Repeat, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sub-Broker & Partner Console | Portfolio Pro",
};

export default function SubBrokerDashboardPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="Sub-Broker"
        userName="Maheshwari Wealth Partners"
        subTitle="Mapped ARN: ARN-189420-SB01 | Partner Desk"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Partner Supervised AUM
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">₹14.80 Cr</div>
            <div className="text-[11px] text-gray-500 mt-1">94 Mapped Client Accounts</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Monthly Payout Share (60% Slab)
            </span>
            <div className="text-2xl font-serif font-bold text-gold-dark mt-1">₹74,200 / mo</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">Direct Bank Credit</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Active SIP Mandates
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">₹6.4L Monthly</div>
            <div className="text-[11px] text-gray-500 mt-1">112 Live SIPs</div>
          </Card>
        </div>

        <div className="bg-white p-6 rounded border border-rule shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-navy border-b border-rule pb-3">
            Partner Revenue Sharing & Invoices
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-ivory rounded border border-rule flex justify-between items-center">
              <div>
                <span className="font-bold text-navy">September 2026 Trail Payout</span>
                <div className="text-[10px] text-gray-500">Gross: ₹1,23,666 • Share 60%</div>
              </div>
              <span className="font-bold text-emerald-800 font-mono">₹74,200 Paid</span>
            </div>
            <div className="p-3 bg-ivory rounded border border-rule flex justify-between items-center">
              <div>
                <span className="font-bold text-navy">August 2026 Trail Payout</span>
                <div className="text-[10px] text-gray-500">Gross: ₹1,18,500 • Share 60%</div>
              </div>
              <span className="font-bold text-emerald-800 font-mono">₹71,100 Paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

