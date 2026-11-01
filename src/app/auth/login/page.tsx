"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteConfig } from "@/config/site";
import { Lock, Mail, Key, Shield, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

const DEMO_ACCOUNTS: Record<string, { email: string; name: string; target: string }> = {
  INVESTOR: { email: "investor@portfoliopro.in", name: "Rajesh Sharma (Client)", target: "/dashboard/investor" },
  ADVISOR: { email: "advisor@portfoliopro.in", name: "Vikramaditya Singhania (ARN-189420)", target: "/dashboard/advisor" },
  CORPORATE: { email: "corporate@portfoliopro.in", name: "Apex Capital Advisors", target: "/dashboard/corporate" },
  EMPLOYEE: { email: "employee@portfoliopro.in", name: "Pooja Iyer (Operations)", target: "/dashboard/employee" },
  SUB_BROKER: { email: "subbroker@portfoliopro.in", name: "Maheshwari Wealth Partners", target: "/dashboard/sub-broker" },
  BRANCH: { email: "branch@portfoliopro.in", name: "BKC Central Branch Office", target: "/dashboard/branch" },
  RM: { email: "rm@portfoliopro.in", name: "Amitav Deshmukh (Sr. RM)", target: "/dashboard/rm" },
  ADMIN: { email: "admin@portfoliopro.in", name: "Siddharth Mehta (Super Admin)", target: "/dashboard/admin" },
};

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "INVESTOR";
  const initialRole = DEMO_ACCOUNTS[roleParam] ? roleParam : "INVESTOR";

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState(DEMO_ACCOUNTS[initialRole]?.email || "investor@portfoliopro.in");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const demoAccounts = DEMO_ACCOUNTS;

  useEffect(() => {
    const qRole = searchParams.get("role");
    if (qRole && DEMO_ACCOUNTS[qRole]) {
      setRole(qRole);
      setEmail(DEMO_ACCOUNTS[qRole].email);
    }
  }, [searchParams]);

  useEffect(() => {
    if (DEMO_ACCOUNTS[role]) {
      setEmail(DEMO_ACCOUNTS[role].email);
    }
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // Route to role-specific dashboard
      const targetDashboard = demoAccounts[role]?.target || `/dashboard/${role.toLowerCase().replace("_", "-")}`;
      router.push(targetDashboard);
    } catch {
      setError("An unexpected authentication error occurred");
      setLoading(false);
    }
  };

  const currentRoleInfo = siteConfig.loginRoles.find((r) => r.id === role) || siteConfig.loginRoles[0];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Logo strictly on Navy background */}
      <div className="flex justify-center mb-8">
        <BrandLogo theme="dark" showTagline />
      </div>

      <div className="bg-navy-dark p-8 rounded-[4px] border-2 border-gold/70 shadow-classic-lg text-white">
        <div className="border-b border-navy-light pb-4 mb-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-navy px-3 py-1 rounded border border-gold/40 inline-block mb-2">
            Secure Portal Authentication
          </span>
          <h2 className="font-serif text-2xl font-bold text-white">
            {currentRoleInfo.label}
          </h2>
          <p className="text-xs text-gray-300 mt-1">{currentRoleInfo.description}</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-gold mb-2">
            Switch Portal Role:
          </label>
          <select
            value={role}
            onChange={(e) => {
              const selectedRole = e.target.value;
              setRole(selectedRole);
              if (DEMO_ACCOUNTS[selectedRole]) {
                setEmail(DEMO_ACCOUNTS[selectedRole].email);
              }
            }}
            className="w-full p-2.5 bg-navy border border-gold/40 text-white rounded text-xs focus:outline-none focus:border-gold font-semibold"
          >
            {siteConfig.loginRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} ({r.badge})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-950/80 border border-red-500 text-red-200 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@portfoliopro.in"
                className="w-full pl-9 pr-3 py-2.5 bg-navy border border-navy-light text-white rounded focus:outline-none focus:border-gold font-sans text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-gold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-navy border border-navy-light text-white rounded focus:outline-none focus:border-gold font-sans text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gold text-navy font-bold text-xs uppercase tracking-wider rounded shadow-classic hover:bg-gold-light transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-navy" />
                <span>Authenticating Securely...</span>
              </>
            ) : (
              <>
                <span>Sign In to {currentRoleInfo.label}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Switch Helpers */}
        <div className="mt-6 pt-4 border-t border-navy-light space-y-2 text-[11px] text-gray-400">
          <div className="flex justify-between items-center text-gold font-semibold">
            <span>Demo Test Password:</span>
            <span className="font-mono bg-navy px-2 py-0.5 rounded border border-gold/40 text-white">
              password123
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link href="/auth/register" className="text-gold font-bold hover:underline">
              Register New Account →
            </Link>
            <Link href="/auth/forgot-password" className="text-gray-300 hover:text-gold underline">
              Forgot Password?
            </Link>
          </div>
          <div className="flex justify-between items-center pt-1 text-[10px]">
            <Link href="/auth/otp-login" className="text-gray-400 hover:text-gold underline">
              Login via Mobile OTP
            </Link>
            <Link href="/" className="text-gray-400 hover:text-gold underline">
              ← Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-gold text-center">Loading login portal...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}

