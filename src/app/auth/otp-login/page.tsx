"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Smartphone, CheckCircle2, ArrowRight, Loader2, KeyRound } from "lucide-react";

export default function OtpLoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("9820112345");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456" && otp.length !== 6) {
      setError("Invalid OTP. Use mock OTP: 123456");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      // Authenticated as investor
      router.push("/dashboard/investor");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <BrandLogo theme="dark" showTagline />
        </div>

        <div className="bg-navy-dark p-8 rounded-[4px] border-2 border-gold/70 shadow-classic-lg text-white">
          <div className="border-b border-navy-light pb-4 mb-6 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-navy px-3 py-1 rounded border border-gold/40 inline-block mb-2">
              Passwordless Authentication
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">Mobile OTP Login</h2>
            <p className="text-xs text-gray-300 mt-1">
              Access your investor or client portfolio with one-time SMS verification.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-950/80 border border-red-500 text-red-200 text-xs rounded">
              {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Registered Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-navy-light bg-navy text-gold text-xs font-semibold rounded-l">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98201 12345"
                    className="flex-1 px-3.5 py-2.5 bg-navy border border-navy-light text-white rounded-r focus:outline-none focus:border-gold font-sans text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold text-navy font-bold text-xs uppercase tracking-wider rounded shadow-classic hover:bg-gold-light transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-navy" />
                    <span>Sending 6-Digit OTP...</span>
                  </>
                ) : (
                  <span>Send OTP via SMS</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="p-3 bg-navy rounded border border-gold/40 text-center">
                <span className="text-gray-300 text-[11px]">OTP dispatched to +91 {mobile}</span>
                <div className="text-gold font-semibold text-xs mt-0.5">
                  Mock OTP for testing: <strong className="font-mono text-white">123456</strong>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full p-2.5 bg-navy border border-navy-light text-white rounded focus:outline-none focus:border-gold text-center font-mono font-bold text-lg tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold text-navy font-bold text-xs uppercase tracking-wider rounded shadow-classic hover:bg-gold-light transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-navy" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify & Open Portfolio</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-navy-light text-center text-[11px]">
            <Link href="/auth/login" className="text-gray-400 hover:text-gold underline">
              ← Login with Password instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

