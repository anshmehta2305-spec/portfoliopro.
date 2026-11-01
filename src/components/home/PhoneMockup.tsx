import React from "react";
import { ArrowUpRight, TrendingUp, ShieldCheck, Check, Smartphone } from "lucide-react";

interface PhoneMockupProps {
  appType: "investor" | "advisor";
  appName?: string;
}

export function PhoneMockup({ appType, appName = "Your Wealth Firm" }: PhoneMockupProps) {
  const isInvestor = appType === "investor";

  return (
    <div className="relative mx-auto w-[290px] sm:w-[310px] h-[580px] bg-navy-dark rounded-[36px] p-3 shadow-2xl border-4 border-gold/60 select-none">
      {/* Top Phone Speaker / Camera Notch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-navy rounded-full flex items-center justify-center gap-2 z-20">
        <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
        <div className="w-8 h-1 bg-[#222] rounded-full" />
      </div>

      {/* Screen Inner Container */}
      <div className="w-full h-full bg-[#FAF7F0] rounded-[28px] overflow-hidden flex flex-col pt-7 text-charcoal text-[11px] font-sans">
        {/* App Top Bar */}
        <div className="bg-navy px-4 py-2.5 text-white flex items-center justify-between border-b border-gold/40">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-brand-blue flex items-center justify-center text-[9px] font-bold text-white">
              P
            </div>
            <span className="font-serif font-bold text-xs tracking-tight text-white">{appName}</span>
          </div>
          <span className="text-[9px] text-gold font-semibold uppercase">
            {isInvestor ? "Client App" : "Advisor Desk"}
          </span>
        </div>

        {/* Dynamic Screen Content */}
        {isInvestor ? (
          <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
            {/* Portfolio Value Card */}
            <div className="bg-white p-3 rounded-[4px] border border-rule shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                Total Portfolio Valuation
              </span>
              <div className="text-xl font-bold font-serif text-navy mt-0.5">₹48,50,000</div>
              <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +21.4% XIRR
                </span>
                <span className="text-gray-500">Invested: ₹36.2L</span>
              </div>
            </div>

            {/* Active SIPs Banner */}
            <div className="bg-navy text-white p-2.5 rounded-[4px] border border-gold/50 flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-gold font-bold">
                  Next SIP Execution
                </div>
                <div className="font-bold text-xs mt-0.5">05 Nov • ₹25,000</div>
                <div className="text-[9px] text-gray-300">HDFC Top 100 Fund</div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded">
                AutoPay Active
              </span>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
              <div className="p-2 bg-white rounded border border-rule font-medium">Invest More</div>
              <div className="p-2 bg-white rounded border border-rule font-medium">Switch / STP</div>
              <div className="p-2 bg-white rounded border border-rule font-medium">Reports</div>
            </div>

            {/* Goal GPS Bar */}
            <div className="bg-white p-2.5 rounded border border-rule space-y-1.5">
              <div className="flex justify-between font-semibold text-[10px]">
                <span>Retirement Corpus Goal</span>
                <span className="text-navy">57% Funded</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gold h-full w-[57%]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
            {/* Advisor AUM Counter */}
            <div className="bg-navy text-white p-3 rounded-[4px] border border-gold">
              <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                Total AUM Supervised
              </span>
              <div className="text-xl font-bold font-serif mt-0.5">₹78.4 Crore</div>
              <div className="text-[10px] text-gray-300 mt-1 flex justify-between">
                <span>Active Clients: 420</span>
                <span>Monthly SIP Book: ₹38.5L</span>
              </div>
            </div>

            {/* BSE / NSE Order Queue */}
            <div className="bg-white p-2.5 rounded border border-rule space-y-1.5">
              <div className="flex justify-between font-bold text-[10px] text-navy border-b border-rule pb-1">
                <span>Pending Approvals</span>
                <span className="text-brand-blue font-semibold">4 Orders</span>
              </div>
              <div className="text-[10px] flex justify-between items-center py-1">
                <div>
                  <div className="font-bold">Rajesh Sharma</div>
                  <div className="text-gray-500 text-[9px]">Lumpsum ₹1,00,000 (ICICI Bluechip)</div>
                </div>
                <span className="px-1.5 py-0.5 bg-gold/15 text-gold-dark text-[9px] font-bold rounded">
                  Link Sent
                </span>
              </div>
            </div>

            {/* Daily Tasks */}
            <div className="bg-white p-2.5 rounded border border-rule text-[10px] space-y-1">
              <div className="font-bold text-navy">Today&apos;s Follow-ups (3)</div>
              <div className="text-gray-600 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> CAMS CAS mailback reconciled
              </div>
              <div className="text-gray-600 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> Birthday nudge sent to 2 clients
              </div>
            </div>
          </div>
        )}

        {/* Phone Bottom Home Bar */}
        <div className="p-2 bg-navy text-center border-t border-navy-light">
          <div className="w-20 h-1 bg-gray-400 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}

