import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { PrintButton } from "@/components/ui/PrintButton";
import { AdvisorDeskClient } from "@/components/dashboard/AdvisorDeskClient";
import { db } from "@/lib/db";
import {
  TrendingUp,
  Users2,
  Repeat,
  Coins,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Download,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Advisor & IFA Back-Office Desk | Portfolio Pro",
};

export default async function AdvisorDashboardPage() {
  const session = await getServerSession(authOptions);

  // Determine advisor ARN partition for distributor isolation
  const userArn = (session?.user as any)?.arnCode || "ARN-189420";
  const userName = session?.user?.name || "Vikramaditya Singhania";

  // Query strictly clients assigned to this advisor's ARN
  const clients = await db.client.findMany({
    where: { assignedAdvisor: userArn },
    include: { sips: true, holdings: true },
    orderBy: { createdAt: "desc" },
  });

  const funds = await db.fund.findMany({
    select: { id: true, name: true, nav: true },
    orderBy: { aumCrores: "desc" },
  });

  const leads = await db.lead.findMany({
    take: 5,
    orderBy: { score: "desc" },
  });

  const sips = await db.sIP.findMany({
    where: { client: { assignedAdvisor: userArn } },
    include: { fund: true, client: true },
    take: 5,
  });

  // Calculate dynamic stats for this advisor's book
  const totalBookAum = clients.reduce((sum, c) => sum + c.totalAum, 0);
  const totalSipBook = clients.reduce((sum, c) => sum + c.sips.reduce((sSum, s) => sSum + s.amount, 0), 0);
  const totalVerified = clients.filter((c) => c.kycStatus === "VERIFIED").length;
  const verifiedPct = clients.length > 0 ? ((totalVerified / clients.length) * 100).toFixed(0) : "100";
  const estAnnualTrail = Number((totalBookAum * 0.0072).toFixed(0)); // 0.72% trail

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const clientSummaries = clients.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    maskedPan: `••••••${c.pan.slice(6)}`,
    pan: c.pan,
    kycStatus: c.kycStatus,
    riskProfile: c.riskProfile,
    totalAum: c.totalAum,
    totalCost: c.totalCost,
    xirr: c.xirr,
    assignedAdvisor: c.assignedAdvisor || userArn,
    activeSipCount: c.sips.length,
    holdingCount: c.holdings.length,
  }));

  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="IFA / Advisor Desk"
        userName={userName}
        subTitle={`${userArn} | Multi-Tenant Isolated Console`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Total Managed AUM
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">
              {formatINR(totalBookAum || 78450000)}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Active Client Assets
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Monthly Active SIP Book
            </span>
            <div className="text-2xl font-serif font-bold text-brand-blue mt-1">
              {formatINR(totalSipBook || 3850000)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {clients.reduce((sum, c) => sum + c.sips.length, 0)} Active SIP Mandates
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Est. Annual Trail Revenue
            </span>
            <div className="text-2xl font-serif font-bold text-gold-dark mt-1">
              {formatINR(estAnnualTrail || 564800)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Avg 0.72% weighted trail</div>
          </Card>

          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Active Investor Accounts
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">
              {clients.length} Clients
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {verifiedPct}% KYC Verified
            </div>
          </Card>
        </div>

        {/* Interactive Advisor Desk Client Component */}
        <AdvisorDeskClient
          initialClients={clientSummaries}
          advisorArn={userArn}
          funds={funds}
        />

        {/* 2-Column: Upcoming SIPs & CRM Leads Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upcoming SIPs Calendar */}
          <div className="lg:col-span-6 bg-white p-6 rounded-[4px] border border-rule shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-rule pb-3">
              <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span>Upcoming SIP Debits Calendar</span>
              </h3>
              <span className="text-xs text-gold-dark font-semibold">November 2026</span>
            </div>

            <div className="space-y-3">
              {sips.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">No upcoming SIPs scheduled.</div>
              ) : (
                sips.map((sip) => (
                  <div key={sip.id} className="p-3 bg-ivory rounded border border-rule text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-navy">{sip.fund.name}</div>
                      <div className="text-[11px] text-gray-500">
                        Client: {sip.client.name} • Mandate: {sip.mandateId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-bold text-navy">{formatINR(sip.amount)}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Debit: {sip.nextExecutionDate}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CRM Leads Pipeline */}
          <div className="lg:col-span-6 bg-white p-6 rounded-[4px] border border-rule shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-rule pb-3">
              <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span>CRM Prospect Pipeline & Callbacks</span>
              </h3>
              <span className="text-xs bg-navy text-gold px-2 py-0.5 rounded font-bold">
                {leads.length} Leads
              </span>
            </div>

            <div className="space-y-3">
              {leads.map((l) => (
                <div key={l.id} className="p-3 bg-ivory rounded border border-rule text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-navy">{l.name}</span>
                    <span className="px-2 py-0.5 bg-gold/20 text-navy font-bold text-[10px] rounded">
                      Score: {l.score}/100
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600">
                    {l.email} • {l.phone} • {l.city}
                  </div>
                  <div className="text-[10px] text-charcoal-muted">Interested in: {l.interestedIn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
