"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2, CheckCircle2, TrendingUp, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

interface Fund {
  id: string;
  name: string;
  nav: number;
  oneYearReturn: number;
}

export function FundDetailClient({ fund }: { fund: Fund }) {
  const [tab, setTab] = useState<"SIP" | "LUMPSUM">("SIP");
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [sipDate, setSipDate] = useState<number>(10);
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(50000);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

  return (
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

      {successMsg ? (
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
                <div className="flex gap-2 mt-2">
                  {[1000, 2500, 5000, 10000, 25000].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setSipAmount(val)}
                      className="px-2 py-1 bg-ivory hover:bg-gold/20 text-navy font-semibold text-[11px] rounded border border-rule"
                    >
                      ₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>
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

              <div className="p-3 bg-ivory rounded border border-rule text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Estimated Units / Installment:</span>
                  <span className="font-semibold text-navy">{(sipAmount / fund.nav).toFixed(3)} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Execution Mode:</span>
                  <span className="font-semibold text-emerald-700">NPCI e-Mandate / BSE StarMF</span>
                </div>
              </div>
            </>
          ) : (
            <>
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
                <div className="flex gap-2 mt-2">
                  {[5000, 25000, 50000, 100000, 500000].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setLumpsumAmount(val)}
                      className="px-2 py-1 bg-ivory hover:bg-gold/20 text-navy font-semibold text-[11px] rounded border border-rule"
                    >
                      ₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-ivory rounded border border-rule text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Allotted Units (at ₹{fund.nav.toFixed(2)} NAV):</span>
                  <span className="font-semibold text-navy">{(lumpsumAmount / fund.nav).toFixed(3)} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Settlement Rail:</span>
                  <span className="font-semibold text-emerald-700">ICCL / BSE StarMF Clearing</span>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-navy hover:bg-navy-light text-gold font-bold text-xs uppercase tracking-wider rounded shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
            ) : (
              <>
                <span>{tab === "SIP" ? "Activate SIP Mandate" : "Proceed with Purchase"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </Card>
  );
}

