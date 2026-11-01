"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Lock, Mail, User, Phone, CreditCard, Shield, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"INVESTOR" | "ADVISOR">("INVESTOR");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [arnCode, setArnCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          pan,
          arnCode: role === "ADVISOR" ? arnCode : undefined,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch {
      setError("Network or server error during registration.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <BrandLogo theme="dark" showTagline />
        </div>

        <div className="bg-navy-dark p-8 rounded-[4px] border-2 border-gold/70 shadow-classic-lg text-white">
          <div className="border-b border-navy-light pb-4 mb-6 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-navy px-3 py-1 rounded border border-gold/40 inline-block mb-2">
              New Account Registration
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Create Your {role === "INVESTOR" ? "Investor" : "Advisor"} Portal
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Join thousands of investors and financial advisors using Portfolio Pro.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex rounded border border-gold/40 p-1 mb-6 bg-navy">
            <button
              type="button"
              onClick={() => setRole("INVESTOR")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                role === "INVESTOR" ? "bg-brand-blue text-white shadow" : "text-gray-300 hover:text-white"
              }`}
            >
              Investor / Client
            </button>
            <button
              type="button"
              onClick={() => setRole("ADVISOR")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
                role === "ADVISOR" ? "bg-brand-blue text-white shadow" : "text-gray-300 hover:text-white"
              }`}
            >
              MFD / Advisor Desk
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-500/60 text-red-200 text-xs rounded">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-white">Account Created Successfully!</h3>
              <p className="text-xs text-gray-300">Redirecting you to the secure login screen...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Legal Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rajesh@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Mobile (10 digits) *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9820112345"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {role === "INVESTOR" ? (
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">PAN Card Number *</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded uppercase font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-300 font-semibold mb-1">AMFI ARN Code *</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={arnCode}
                        onChange={(e) => setArnCode(e.target.value.toUpperCase())}
                        placeholder="ARN-189420"
                        className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded uppercase font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Password (min 8 characters) *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gold hover:bg-gold-dark text-navy font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4 shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Registration"}
              </button>
            </form>
          )}

          <div className="border-t border-navy-light pt-4 mt-6 text-center text-xs text-gray-300">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-gold hover:underline font-semibold">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

