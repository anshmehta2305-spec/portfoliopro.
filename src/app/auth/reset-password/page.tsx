"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Lock, Mail, CheckCircle2, Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch {
      setError("Error connecting to server.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-navy-dark p-8 rounded-[4px] border-2 border-gold/70 shadow-classic-lg text-white">
      <div className="border-b border-navy-light pb-4 mb-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-white">Set New Password</h2>
        <p className="text-xs text-gray-300 mt-1">Enter your email and create a secure new password.</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/80 border border-red-500/60 text-red-200 text-xs rounded">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center py-6 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">Password Updated!</h3>
          <p className="text-xs text-gray-300">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@portfoliopro.in"
                className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">New Password (min 8 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-navy border border-gold/40 text-white rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
            className="w-full py-2.5 bg-gold hover:bg-gold-dark text-navy font-bold rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save New Password"}
          </button>
        </form>
      )}

      <div className="text-center pt-4">
        <Link href="/auth/login" className="text-xs text-gray-400 hover:text-gold underline">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <BrandLogo theme="dark" showTagline />
        </div>
        <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

