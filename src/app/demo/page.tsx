"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Card } from "@/components/ui/Card";
import { Lock, Key, ArrowRight, ShieldCheck, UserCheck, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const DEMO_PRESETS = [
  {
    role: "INVESTOR",
    title: "Investor Portal Showcase",
    name: "Rajesh Sharma",
    email: "investor@portfoliopro.in",
    target: "/dashboard/investor",
    description: "Multi-asset family portfolio, ₹48.5 Lakh AUM, XIRR returns & goal tracking.",
    badge: "Client Experience",
  },
  {
    role: "ADVISOR",
    title: "IFA / Distributor Desk",
    name: "Vikramaditya Singhania",
    email: "advisor@portfoliopro.in",
    target: "/dashboard/advisor",
    description: "Complete distributor cockpit: 3 client folios, ₹1.45 Cr AUM, brokerage MIS.",
    badge: "Distributor CRM",
  },
  {
    role: "ADMIN",
    title: "Platform Admin Master Console",
    name: "Siddharth Mehta",
    email: "admin@portfoliopro.in",
    target: "/dashboard/admin",
    description: "Enterprise management: User accounts, AMFI fund catalogs, security audit trails.",
    badge: "Super Admin",
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Accept default presentation passcode or custom env
    if (accessCode.trim() === "demomode2026" || accessCode.trim() === "portfoliopro") {
      setIsUnlocked(true);
    } else {
      setError("Invalid presentation access passcode. Please contact your administrator.");
    }
  };

  const handleLaunchDemo = async (preset: typeof DEMO_PRESETS[0]) => {
    setLoadingRole(preset.role);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: preset.email,
        password: "password123",
        role: preset.role,
      });

      if (res?.error) {
        setError(`Unable to launch ${preset.title}: ${res.error}`);
        setLoadingRole(null);
        return;
      }

      router.push(preset.target);
    } catch {
      setError("An unexpected error occurred launching the demo.");
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-navy py-16 px-4 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo theme="dark" showTagline />
        </div>

        {!isUnlocked ? (
          <div className="bg-navy-dark p-8 rounded border-2 border-gold/70 shadow-classic text-white max-w-md mx-auto">
            <div className="text-center mb-6">
              <span className="p-2 bg-navy rounded-full inline-flex items-center justify-center border border-gold/40 text-gold mb-3">
                <Lock className="w-5 h-5" />
              </span>
              <h1 className="font-serif text-2xl font-bold">Private Presentation Portal</h1>
              <p className="text-xs text-gray-300 mt-1">
                Enter your distributor passcode to unlock the interactive product showcase.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/60 border border-red-500 text-red-200 text-xs rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gold mb-1">
                  Presentation Access Passcode
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gold absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Enter demo passcode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full bg-navy border border-navy-light pl-9 pr-3 py-2 text-sm text-white rounded focus:outline-none focus:border-gold font-mono"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Default presentation passcode: <span className="font-mono text-gold">demomode2026</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gold text-navy font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
              >
                <span>Unlock Showcase</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link href="/" className="text-xs text-gray-400 hover:text-gold">
                  ← Return to Public Website
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-navy-dark p-8 rounded border-2 border-gold/70 shadow-classic text-white">
            <div className="flex justify-between items-center border-b border-navy-light pb-4 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  Access Granted • Presentation Mode
                </span>
                <h2 className="font-serif text-2xl font-bold mt-1">Select Persona to Demo</h2>
              </div>
              <button
                onClick={() => setIsUnlocked(false)}
                className="text-xs text-gray-400 hover:text-gold underline"
              >
                Lock Portal
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-900/60 border border-red-500 text-red-200 text-xs rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {DEMO_PRESETS.map((preset) => (
                <div
                  key={preset.role}
                  className="bg-navy p-5 rounded border border-navy-light hover:border-gold transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gold uppercase tracking-wider">
                        {preset.badge}
                      </span>
                      <span className="text-[11px] text-gray-400">({preset.name})</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-white">{preset.title}</h3>
                    <p className="text-xs text-gray-300">{preset.description}</p>
                  </div>

                  <button
                    onClick={() => handleLaunchDemo(preset)}
                    disabled={loadingRole !== null}
                    className="shrink-0 px-4 py-2.5 bg-gold hover:bg-gold-light text-navy font-bold text-xs rounded uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <span>{loadingRole === preset.role ? "Launching..." : "Launch Demo"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-navy-light text-center text-xs text-gray-400">
              <span>This private presentation mode runs in sandbox simulation. No real money or client folios are altered.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

