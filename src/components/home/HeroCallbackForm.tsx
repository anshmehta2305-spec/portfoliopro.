"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function HeroCallbackForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [arn, setArn] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Please provide your Name and Mobile Number");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim().replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, arn, city }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Unable to submit right now. Please call our desk directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-[4px] border-2 border-gold shadow-classic-lg text-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-serif text-xl font-bold text-navy">Priority Call Scheduled</h4>
        <p className="text-xs text-charcoal leading-relaxed">{t.callback.successMessage}</p>
        <div className="p-3 bg-ivory rounded text-[11px] text-gray-500 font-sans">
          A dedicated MFD specialist is reviewing your regional requirements.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-7 sm:p-8 rounded-[4px] border-2 border-gold/70 shadow-classic-lg relative">
      <div className="mb-5 text-left border-b border-rule pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold-dark mb-2">
          <Shield className="w-3 h-3 text-gold" />
          <span>Exclusive for Indian MFDs & IFAs</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-navy leading-snug">
          {t.callback.heading}
        </h3>
        <p className="text-xs text-charcoal-muted mt-1">{t.callback.subheading}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
        {error && <div className="p-2 bg-red-50 text-red-600 rounded text-xs">{error}</div>}

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.callback.namePlaceholder}
            className="w-full px-3.5 py-2.5 border border-rule rounded-[2px] focus:outline-none focus:border-gold text-charcoal font-sans text-xs bg-ivory/30"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-rule bg-ivory text-charcoal text-xs font-semibold rounded-l-[2px]">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98200 12345"
              className="flex-1 px-3.5 py-2.5 border border-rule rounded-r-[2px] focus:outline-none focus:border-gold text-charcoal font-sans text-xs bg-ivory/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
              ARN Code
            </label>
            <input
              type="text"
              value={arn}
              onChange={(e) => setArn(e.target.value)}
              placeholder="ARN-XXXXXX"
              className="w-full px-3 py-2.5 border border-rule rounded-[2px] focus:outline-none focus:border-gold text-charcoal font-sans text-xs bg-ivory/30 uppercase"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Pune"
              className="w-full px-3 py-2.5 border border-rule rounded-[2px] focus:outline-none focus:border-gold text-charcoal font-sans text-xs bg-ivory/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 py-3 bg-brand-blue text-white font-bold text-xs uppercase tracking-wider rounded-[2px] shadow-classic hover:bg-navy hover:text-gold transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>{t.callback.submitButton}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <p className="text-[10px] text-gray-500 text-center leading-tight pt-1">
          🔒 Strict NDA guaranteed. We never sell or share distributor information.
        </p>
      </form>
    </div>
  );
}

