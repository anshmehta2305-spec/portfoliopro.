"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2, CheckCircle2, TrendingUp, Calendar, ArrowRight, ShieldCheck, AlertCircle, Phone } from "lucide-react";
import { isLiveTradingEnabled, TRADING_CONFIG } from "@/config/trading";

interface Fund {
  id: string;
  name: string;
  nav: number;
  oneYearReturn: number;
}

export function FundDetailClient({ fund }: { fund: Fund }) {
  const isLive = isLiveTradingEnabled();

  // Live order states
  const [tab, setTab] = useState<"SIP" | "LUMPSUM">("SIP");
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [sipDate, setSipDate] = useState<number>(10);
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(50000);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Lead capture states for showcase mode
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCity, setLeadCity] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (tab === "SIP") {
        const res = await fetch("/api/investments/sip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fundId: fund.id, amount: sipAmount, sipDate }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "SIP registration failed");
        } else {
          setSuccessMsg(data.message);
        }
      } else {
        const res = await fetch("/api/investments/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "PURCHASE", fundId: fund.id, amount: lumpsumAmount }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || "Order execution failed");
        } else {
          setSuccessMsg(data.message);
        }
      }
    } catch {
      setErrorMsg("Network error communicating with order execution engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          email: `${leadPhone.trim()}@client.portfoliopro.in`,
          city: leadCity.trim() || "Bharuch",
          interestedIn: `${fund.name} (${tab === "SIP" ? `₹${sipAmount}/mo SIP` : `₹${lumpsumAmount} Lumpsum`})`,
          source: "FUND_DETAIL_PREVIEW_INQUIRY",
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to register inquiry. Please try calling directly.");
      }

      setLeadSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit investment inquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-white border-2 border-gold/60 shadow-classic">
        <div className="flex border-b border-rule mb-5 pb-1">
          <button
            onClick={() => { setTab("SIP"); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-1 ${
              tab === "SIP" ? "border-gold text-navy" : "border-transparent text-charcoal-muted hover:text-navy"
            }`}
          >
            Start Systematic SIP
          </button>
          <button
            onClick={() => { setTab("LUMPSUM"); setErrorMsg(""); setSuccessMsg(""); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-1 ${
              tab === "LUMPSUM" ? "border-gold text-navy" : "border-transparent text-charcoal-muted hover:text-navy"
            }`}
          >
            One-Time Lumpsum
          </button>
        </div>

        {/* If live trading is enabled, render real order submission */}
        {isLive ? (
          successMsg ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-base font-bold text-navy">Order Executed Successfully!</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">{successMsg}</p>
              <button
                onClick={() => { setSuccessMsg(""); }}
                className="mt-3 px-4 py-2 bg-navy text-gold text-xs font-bold rounded"
              >
                Place Another Order
              </button>
            </div>
          ) : (
            <form onSubmit={handleOrder} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs">
                  {errorMsg}
                </div>
              )}

              {tab === "SIP" ? (
                <>
                  <div>
                    <label className="block text-charcoal font-semibold mb-1">
                      Monthly SIP Installment Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={500}
                      step={500}
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="w-full p-2.5 border border-rule rounded text-sm font-bold text-navy focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal font-semibold mb-1">
                      Monthly Execution Day (1 - 28)
                    </label>
                    <select
                      value={sipDate}
                      onChange={(e) => setSipDate(Number(e.target.value))}
                      className="w-full p-2.5 border border-rule rounded text-xs text-charcoal focus:outline-none focus:border-gold"
                    >
                      {[1, 5, 7, 10, 15, 20, 25, 28].map((d) => (
                        <option key={d} value={d}>
                          {d}th of every month
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-charcoal font-semibold mb-1">
                    Lumpsum Purchase Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={lumpsumAmount}
                    onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-rule rounded text-sm font-bold text-navy focus:outline-none focus:border-gold"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-navy hover:bg-navy-light text-gold font-bold text-xs uppercase tracking-wider rounded shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : (
                  <>
                    <span>{tab === "SIP" ? "Activate SIP Mandate" : "Proceed with Purchase"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )
        ) : (
          /* SHOWCASE PREVIEW MODE (When LIVE_TRADING_ENABLED=false) */
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Online Investing Coming Soon</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-950">
                Direct online transaction rails are currently in preview. To start an investment in{" "}
                <strong>{fund.name}</strong>, submit your request below and your registered distributor will assist with your onboarding.
              </p>
            </div>

            {leadSubmitted ? (
              <div className="text-center py-6 space-y-2 bg-emerald-50 border border-emerald-200 rounded p-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-sm font-bold text-navy">Inquiry Received</h4>
                <p className="text-[11px] text-charcoal leading-relaxed">
                  Thank you! Your investment request for <strong>{fund.name}</strong> has been forwarded to our distributor desk. We will call you at <strong>{leadPhone}</strong> to assist with your portfolio setup.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                {errorMsg && (
                  <div className="p-2 bg-red-50 text-red-700 rounded text-xs border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-charcoal font-semibold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full p-2 border border-rule rounded text-xs focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-charcoal font-semibold mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full p-2 border border-rule rounded text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-charcoal font-semibold mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bharuch, Surat, Mumbai"
                      value={leadCity}
                      onChange={(e) => setLeadCity(e.target.value)}
                      className="w-full p-2 border border-rule rounded text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-ivory rounded border border-rule text-[11px] flex justify-between items-center">
                  <span className="text-charcoal-muted">Target Scheme & Mode:</span>
                  <span className="font-bold text-navy">
                    {tab === "SIP" ? `₹${sipAmount.toLocaleString()} / mo SIP` : `₹${lumpsumAmount.toLocaleString()} Lumpsum`}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-navy hover:bg-navy-light text-gold font-bold text-xs uppercase tracking-wider rounded shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  ) : (
                    <>
                      <span>Contact Distributor to Invest</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </Card>

      {/* Mandatory SEBI / AMFI Risk Disclaimer */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded text-[11px] text-amber-900 leading-relaxed font-sans">
        <span className="font-bold">Regulatory Notice: </span>
        {TRADING_CONFIG.statutoryRiskDisclaimer}
      </div>
    </div>
  );
}
