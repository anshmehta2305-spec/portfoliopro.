import React from "react";
import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/Card";
import { FileSpreadsheet, CheckCircle2, Clock, AlertTriangle, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Operations Desk | Portfolio Pro",
};

export default function EmployeeDashboardPage() {
  const syncLogs = [
    { source: "CAMS Mailback Feed (WBR2)", time: "06:15 AM", status: "RECONCILED", records: "1,420 Txns" },
    { source: "KFintech Daily Statement (WBR9)", time: "06:40 AM", status: "RECONCILED", records: "892 Txns" },
    { source: "BSE StarMF Allotment Confirmation", time: "07:10 AM", status: "RECONCILED", records: "248 Orders" },
    { source: "NSE NMF Order Status Report", time: "07:25 AM", status: "RECONCILED", records: "112 Orders" },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <DashboardHeader
        roleName="Operations Lead"
        userName="Pooja Iyer"
        subTitle="Back-Office Operations & RTA Reconciliation Desk"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <Card className="p-5 border-l-4 border-l-navy bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Today&apos;s Ingested Records
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">2,672 Txns</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">100% Matched</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-brand-blue bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              Unmatched Folios
            </span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">0 Pending</div>
            <div className="text-[11px] text-gray-500 mt-1">Zero Discrepancy</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-gold bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              e-Mandate Verifications
            </span>
            <div className="text-2xl font-serif font-bold text-gold-dark mt-1">18 Mandates</div>
            <div className="text-[11px] text-gray-500 mt-1">NPCI AutoPay cleared</div>
          </Card>
          <Card className="p-5 border-l-4 border-l-emerald-600 bg-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-muted">
              RTA Mailbox Status
            </span>
            <div className="text-xl font-serif font-bold text-emerald-800 mt-1">Synchronized</div>
            <div className="text-[11px] text-gray-500 mt-1">Next Poll: 11:00 AM</div>
          </Card>
        </div>

        <div className="bg-white p-6 rounded border border-rule shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-navy border-b border-rule pb-3">
            Morning Automated Ingestion Audit Log
          </h3>
          <div className="space-y-3">
            {syncLogs.map((log, i) => (
              <div key={i} className="p-3.5 bg-ivory rounded border border-rule flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-gold shrink-0" />
                  <div>
                    <span className="font-bold text-navy">{log.source}</span>
                    <span className="text-gray-500 text-[11px] ml-2">Processed at {log.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-gray-600">{log.records}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

