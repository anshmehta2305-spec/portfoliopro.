import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { PrintButton } from "@/components/ui/PrintButton";
import { InvestorActionModals } from "@/components/dashboard/InvestorActionModals";
import { db } from "@/lib/db";
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  FileText,
  Target,
  ArrowUpRight,
  Download,
  CheckCircle2,
  PieChart as PieIcon,
  Repeat,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Investor Portfolio Dashboard | Portfolio Pro",
};

export default async function InvestorDashboardPage() {
  const session = await getServerSession(authOptions);

  // Fetch authenticated client, or fallback to first client for preview
  let client = null;
  if (session?.user?.email) {
    client = await db.client.findFirst({
      where: { email: session.user.email },
      include: {
        holdings: { include: { fund: true } },
        sips: { include: { fund: true } },
        transactions: { take: 10, orderBy: { createdAt: "desc" } },
        goals: true,
        documents: true,
      },
    });
  }

  if (!client) {
    client = await db.client.findFirst({
      include: {
        holdings: { include: { fund: true } },
        sips: { include: { fund: true } },
        transactions: { take: 10, orderBy: { createdAt: "desc" } },
        goals: true,
        documents: true,
      },
    });
  }

  // Fetch all available funds for the transact modals
  const funds = await db.fund.findMany({
    select: { id: true, name: true, nav: true, category: true },
    orderBy: { aumCrores: "desc" },
  });

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalAum = client?.totalAum || 0;
  const totalCost = client?.totalCost || 0;
  const totalGain = totalAum - totalCost;
  const absReturnPct = totalCost > 0 ? Number((((totalAum - totalCost) / totalCost) * 100).toFixed(1)) : 0;
  const xirr = client?.xirr || 0;

  // Masked PAN
  const maskedPan = client?.pan ? `••••••${client.pan.slice(6)}` : "ABCPS••••F";

  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="Investor Portal"
        userName={client?.name || "Rajesh Sharma"}
        subTitle={`PAN: ${maskedPan} | Advisor: ${client?.assignedAdvisor || "Direct"}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Interactive Action Modals Bar */}
        <InvestorActionModals
          clientId={client?.id || ""}
          kycStatus={client?.kycStatus || "PENDING"}
          holdings={client?.holdings || []}
          funds={funds}
          clientName={client?.name || ""}
          clientPan={client?.pan || ""}
          clientPhone={client?.phone || ""}
          riskProfile={client?.riskProfile || "MODERATE"}
        />

        {/* Top Summary Portfolio Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Current Portfolio Value
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">
              {formatINR(totalAum)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Invested Cost: {formatINR(totalCost)}
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Total Unrealized Gain
            </span>
            <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">
              +{formatINR(Math.max(0, totalGain))}
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-1">
              +{absReturnPct}% Absolute Return
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Compounded XIRR
            </span>
            <div className="text-2xl font-serif font-bold text-brand-blue mt-1">
              +{xirr}%
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Outperforming Benchmark</span>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              KYC & Profile Status
            </span>
            <div className="text-base font-serif font-bold text-navy mt-1 flex items-center gap-1.5">
              {client?.kycStatus === "VERIFIED" ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700">VERIFIED</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-amber-700">KYC PENDING</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-gold-dark font-semibold mt-1">
              {client?.riskProfile || "MODERATE"}
            </div>
          </Card>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-rule pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-navy">Current Scheme Holdings</h3>
              <p className="text-xs text-charcoal-muted">
                Consolidated folios across AMCs with live NAV and unrealized returns.
              </p>
            </div>
            <span className="text-xs bg-ivory px-3 py-1 rounded border border-rule font-medium text-navy">
              {client?.holdings.length || 0} Active Folios
            </span>
          </div>

          <div className="overflow-x-auto">
            {client?.holdings.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No active holdings found. Click &quot;Transact&quot; above to make your first investment!
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-ivory border-y border-rule font-serif text-navy">
                    <th className="p-3">Scheme Name & Folio</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Units</th>
                    <th className="p-3 text-right">Avg NAV</th>
                    <th className="p-3 text-right">Current NAV</th>
                    <th className="p-3 text-right">Invested Value</th>
                    <th className="p-3 text-right">Current Value</th>
                    <th className="p-3 text-right">Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {client?.holdings.map((h) => (
                    <tr key={h.id} className="border-b border-rule/60 hover:bg-ivory/50">
                      <td className="p-3">
                        <div className="font-bold text-navy">{h.fund.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">Folio: {h.folioNumber}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-ivory text-charcoal rounded border border-rule text-[11px]">
                          {h.fund.category}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono">{h.units.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono">₹{h.avgNav.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-navy">
                        ₹{h.currentNav.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono">{formatINR(h.investedValue)}</td>
                      <td className="p-3 text-right font-mono font-bold text-navy">
                        {formatINR(h.currentValue)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        +{h.absoluteReturn.toFixed(1)}% ({h.xirr}% XIRR)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Active SIPs & Goal GPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active SIPs */}
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                <Repeat className="w-4 h-4 text-gold" />
                <span>Active SIP Mandates ({client?.sips.length || 0})</span>
              </h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                NPCI AutoPay Active
              </span>
            </div>

            <div className="space-y-3">
              {client?.sips.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  No active SIP mandates registered.
                </div>
              ) : (
                client?.sips.map((sip) => (
                  <div key={sip.id} className="p-3.5 bg-ivory rounded border border-rule text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-navy">{sip.fund.name}</span>
                      <span className="font-serif font-bold text-sm text-navy">{formatINR(sip.amount)}/mo</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Folio: {sip.folioNumber}</span>
                      <span>Next SIP: <strong>{sip.nextExecutionDate}</strong> (Day {sip.sipDate})</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Goal GPS */}
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rule pb-3">
              <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                <Target className="w-4 h-4 text-gold" />
                <span>Life Goal GPS ({client?.goals.length || 0})</span>
              </h3>
              <span className="text-xs text-gold-dark font-bold bg-gold/15 px-2 py-0.5 rounded">
                On Track
              </span>
            </div>

            <div className="space-y-4">
              {client?.goals.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  No life goals set. Use &quot;Add Financial Goal&quot; above to plan retirement or education!
                </div>
              ) : (
                client?.goals.map((g) => {
                  const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                  return (
                    <div key={g.id} className="p-3.5 bg-ivory rounded border border-rule space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-navy">{g.title}</span>
                        <span className="font-bold text-gold-dark">Target {g.targetYear}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-600">
                        <span>Accumulated: {formatINR(g.currentAmount)}</span>
                        <span>Target: {formatINR(g.targetAmount)} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions & Downloadable Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-navy border-b border-rule pb-3">
              Recent Order History
            </h3>
            <div className="space-y-2.5">
              {client?.transactions.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">No transactions recorded yet.</div>
              ) : (
                client?.transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-ivory rounded border border-rule text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-navy">{tx.schemeName}</div>
                      <div className="text-[11px] text-gray-500">
                        {tx.type} • {tx.transDate} • Platform: {tx.platform}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-navy">{formatINR(tx.amount)}</div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Downloadable Statements & Tax Reports */}
          <div className="bg-white rounded-[4px] border border-rule shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-navy border-b border-rule pb-3">
              Statements & Tax Dossiers
            </h3>
            <div className="space-y-2.5">
              {client?.documents.map((doc) => (
                <div key={doc.id} className="p-3 bg-ivory rounded border border-rule text-xs flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <div className="font-bold text-navy">{doc.title}</div>
                      <div className="text-[10px] text-gray-500">Classification: {doc.docType}</div>
                    </div>
                  </div>
                  <PrintButton label="Download" icon="download" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
