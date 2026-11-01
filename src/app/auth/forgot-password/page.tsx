"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Mail, CheckCircle2, ArrowRight, Loader2, Key } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <BrandLogo theme="dark" showTagline />
        </div>

        <div className="bg-navy-dark p-8 rounded-[4px] border-2 border-gold/70 shadow-classic-lg text-white">
          <div className="border-b border-navy-light pb-4 mb-6 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">Reset Account Password</h2>
            <p className="text-xs text-gray-300 mt-1">
              Enter your registered advisor or investor email address to receive reset instructions.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-white">Password Reset Link Dispatched</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                If an active account exists for <strong>{email}</strong>, a password reset token has
                been dispatched. Please check your inbox and spam folder.
              </p>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="inline-block px-5 py-2 bg-gold text-navy font-bold text-xs rounded"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="advisor@portfoliopro.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-navy border border-navy-light text-white rounded focus:outline-none focus:border-gold font-sans text-xs"
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
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Link</span>
                )}
              </button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-xs text-gray-400 hover:text-gold underline">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

