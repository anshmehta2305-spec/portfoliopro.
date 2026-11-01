"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Globe } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function UtilityBar() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="bg-navy-dark text-gray-300 text-xs py-2 px-4 border-b border-navy-light/60">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Contact touchpoints */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-gray-300">
          <a
            href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold" />
            <span>{siteConfig.phone}</span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-gold" />
            <span>{siteConfig.email}</span>
          </a>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 hover:text-green-400 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-green-400" />
            <span>WhatsApp: {siteConfig.whatsapp}</span>
          </a>
        </div>

        {/* Right: AMFI badge & Language Switcher */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline-block text-[11px] text-gray-400">
            {siteConfig.arnNumber} | AMFI Registered
          </span>

          {/* English / Hindi Toggle */}
          <div className="inline-flex items-center gap-1.5 bg-navy px-2 py-0.5 rounded border border-navy-light text-[11px]">
            <Globe className="w-3 h-3 text-gold" />
            <button
              onClick={() => setLanguage("en")}
              className={`px-1 rounded ${language === "en" ? "text-gold font-bold" : "text-gray-400 hover:text-white"}`}
            >
              EN
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-1 rounded ${language === "hi" ? "text-gold font-bold" : "text-gray-400 hover:text-white"}`}
            >
              हिन्दी
            </button>
          </div>

          <Link
            href="/book-demo"
            className="text-[11px] font-semibold text-gold hover:text-white uppercase tracking-wider underline underline-offset-2"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </div>
  );
}

