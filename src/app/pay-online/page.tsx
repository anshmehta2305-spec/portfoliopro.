"use client";

import React, { useState } from "react";
import { CreditCard, CheckCircle2, ShieldCheck, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";

export default function PayOnlinePage() {
  const [arn, setArn] = useState("ARN-189420");
  const [selectedPlan, setSelectedPlan] = useState("PROFESSIONAL");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("YEARLY");
  const [firmName, setFirmName] = useState("Singhania Wealth Management");
  const [email, setEmail] = useState("advisor@portfoliopro.in");
  const [mobile, setMobile] = useState("9811054321");

  const [processing, setProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const pricing = {
    STARTER: { monthly: 2499, yearly: 24990 },
    PROFESSIONAL: { monthly: 5999, yearly: 59990 },
    ENTERPRISE: { monthly: 14999, yearly: 149990 },
  };

  const amount = pricing[selectedPlan as keyof typeof pricing][billingCycle === "YEARLY" ? "yearly" : "monthly"];
  const gst = Math.round(amount * 0.18);
  const totalPayable = amount + gst;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Razorpay Integration Scaffold
    setTimeout(() => {
      setProcessing(false);
      setPaidSuccess(true);
      setPaymentId(`pay_RZP_${Date.now()}`);
    }, 1200);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div>
      <div className="bg-navy text-white py-16 border-b border-gold text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="px-3 py-1 bg-navy-light text-gold border border-gold/40 rounded text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gold" />
            <span>256-Bit Encrypted Payment Gateway</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold">
            Pay Platform Subscription Online
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Securely renew or activate your white-label software license via UPI, NetBanking, Debit/Credit
            Card, or Corporate NEFT/RTGS.
          </p>
        </div>
      </div>

      <Section background="ivory" withOrnament>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 rounded-[4px] border border-rule shadow-classic">
            {paidSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-navy">
                  Payment Processed Successfully!
                </h3>
                <div className="p-4 bg-ivory rounded border border-rule text-xs text-charcoal space-y-1.5 text-left max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono font-bold text-navy">{paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan Activated:</span>
                    <span className="font-bold">{selectedPlan} ({billingCycle})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-bold text-emerald-800">{formatINR(totalPayable)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Tax invoice and payment receipt have been emailed to {email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-5 text-xs">
                <div className="border-b border-rule pb-3">
                  <h3 className="font-serif text-xl font-bold text-navy">Subscription Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      AMFI ARN Number
                    </label>
                    <input
                      type="text"
                      required
                      value={arn}
                      onChange={(e) => setArn(e.target.value)}
                      className="w-full p-2.5 border border-rule rounded bg-ivory/30 text-charcoal uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Advisory Firm Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full p-2.5 border border-rule rounded bg-ivory/30 text-charcoal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Select Plan
                    </label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-full p-2.5 border border-rule rounded bg-ivory/30 text-charcoal font-semibold"
                    >
                      <option value="STARTER">Starter MFD Plan</option>
                      <option value="PROFESSIONAL">Professional Advisor (Recommended)</option>
                      <option value="ENTERPRISE">Enterprise Wealth Desk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value as "MONTHLY" | "YEARLY")}
                      className="w-full p-2.5 border border-rule rounded bg-ivory/30 text-charcoal font-semibold"
                    >
                      <option value="YEARLY">Annual Billing (Best Value - Save 17%)</option>
                      <option value="MONTHLY">Monthly Billing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 border border-rule rounded bg-ivory/30 text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full p-2.5 border border-rule rounded bg-ivory/30 text-charcoal"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 bg-navy text-gold font-bold uppercase tracking-wider rounded shadow-classic hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Contacting Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {formatINR(totalPayable)} via Razorpay</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Summary Invoice Card (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[4px] border border-rule shadow-classic space-y-4">
            <h4 className="font-serif text-lg font-bold text-navy border-b border-rule pb-2">
              Invoice Summary
            </h4>
            <div className="space-y-2.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span>Base Software Subscription:</span>
                <span className="font-semibold">{formatINR(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>18% GST (CGST + SGST):</span>
                <span className="font-semibold">{formatINR(gst)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-rule font-bold text-sm text-navy">
                <span>Total Amount Payable:</span>
                <span>{formatINR(totalPayable)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-rule text-[11px] text-gray-500 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>PCI-DSS Level 1 Compliant</span>
              </div>
              <p>
                Supported payment methods: UPI AutoPay, Google Pay, PhonePe, NetBanking (50+ Indian
                banks), Visa, MasterCard, RuPay, Corporate Cards.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

