"use client";

import React, { useState } from "react";
import { AlertCircle, X, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { TRADING_CONFIG, isLiveTradingEnabled } from "@/config/trading";

export function PreviewModeBanner() {
  const [dismissed, setDismissed] = useState(false);

  // If live trading is enabled, do not show preview mode banner
  if (isLiveTradingEnabled() || dismissed) {
    return null;
  }

  return (
    <aside
      aria-label="Demo mode notice"
      className="bg-navy-dark text-amber-300 text-[11px] sm:text-xs py-1.5 px-4 border-b border-gold/40 flex items-center justify-between shadow-sm relative z-50 transition-all font-sans"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-2 text-center w-full">
        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="uppercase tracking-wider text-[10px] bg-navy px-1.5 py-0.5 rounded border border-gold/30">
            Preview Mode
          </span>
        </span>
        <span className="text-gray-200">
          {TRADING_CONFIG.previewBannerText}
        </span>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1 text-gold font-bold hover:underline hover:text-gold-light ml-2"
        >
          <span>Contact Distributor</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="text-gray-400 hover:text-white transition-colors p-1 shrink-0 ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
