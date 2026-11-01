import React from "react";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { Building, Users, Target, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Branch Office Console | Portfolio Pro",
};

export default function BranchDashboardPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="Branch Head"
        userName="BKC Central Branch Office"
        subTitle="Branch Code: BKC-01 | Mumbai"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Branch Total AUM
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">₹42.50 Cr</div>
            <div className="text-[11px] text-gray-500 mt-1">Target: ₹45.0 Cr (94.4%)</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Assigned RM Team
            </span>
            <div className="text-2xl font-serif font-bold text-brand-blue mt-1">5 RMs Active</div>
            <div className="text-[11px] text-gray-500 mt-1">Daily meeting logs monitored</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Monthly Branch SIP Addition
            </span>
            <div className="text-2xl font-serif font-bold text-gold-dark mt-1">₹4.8L New SIPs</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">112% of Target</div>
          </Card>
        </div>

        <div className="bg-white p-6 rounded border border-rule shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-navy border-b border-rule pb-3">
            Relationship Manager Performance Leaderboard
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-ivory rounded border border-rule flex justify-between items-center">
              <div>
                <span className="font-bold text-navy">Amitav Deshmukh (Sr. RM)</span>
                <div className="text-[10px] text-gray-500">AUM: ₹16.2 Cr • 92 Clients</div>
              </div>
              <span className="text-xs font-bold text-emerald-800">118% Target Achieved</span>
            </div>
            <div className="p-3 bg-ivory rounded border border-rule flex justify-between items-center">
              <div>
                <span className="font-bold text-navy">Sneha Kulkarni (Wealth RM)</span>
                <div className="text-[10px] text-gray-500">AUM: ₹12.4 Cr • 78 Clients</div>
              </div>
              <span className="text-xs font-bold text-emerald-800">104% Target Achieved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

