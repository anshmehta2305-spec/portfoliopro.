"use client";

import React, { useState, useEffect } from "react";
import { Shield, Check } from "lucide-react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("portfolio_pro_cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("portfolio_pro_cookie_consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 bg-navy text-white p-4 rounded-[3px] shadow-classic-lg border border-gold/50 text-xs">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="font-semibold text-white font-serif">Security & Privacy Assurance</p>
          <p className="text-gray-300 text-[11px] leading-relaxed">
            We use essential cookies to maintain secure sessions, verify role permissions, and ensure
            regulatory compliance. By continuing, you agree to our privacy framework.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={acceptCookies}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gold text-navy font-bold rounded-[2px] hover:bg-gold-light text-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept & Continue</span>
            </button>
            <a
              href="/privacy-policy"
              className="text-gray-400 hover:text-gold underline text-[11px]"
            >
              Review Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

