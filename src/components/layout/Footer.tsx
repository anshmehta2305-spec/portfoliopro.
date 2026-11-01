import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteConfig } from "@/config/site";
import { getComplianceTextDisplay, TRADING_CONFIG } from "@/config/trading";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-gray-300 border-t-2 border-gold pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-navy-light/70">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <BrandLogo theme="dark" showTagline />
            <p className="text-sm italic font-serif text-gold-light mt-2">
              &ldquo;{siteConfig.tagline}&rdquo;
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              India&apos;s premier white-label technology platform designed specifically for Mutual
              Fund Distributors, IFAs, and corporate wealth desks.
            </p>
            <div className="pt-2 text-xs text-gray-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>
                  {siteConfig.address}, {siteConfig.cityState}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{siteConfig.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{siteConfig.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors text-emerald-400 font-medium"
                >
                  WhatsApp: {siteConfig.whatsapp}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Solutions & Platform */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-gold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rotate-45 bg-gold inline-block" />
              Solutions & Apps
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/solutions/investor-app" className="hover:text-gold transition-colors">
                  Branded Investor Mobile App
                </Link>
              </li>
              <li>
                <Link href="/solutions/advisor-app" className="hover:text-gold transition-colors">
                  IFA Back-Office & CRM Desk
                </Link>
              </li>
              <li>
                <Link href="/solutions/robo-advisory" className="hover:text-gold transition-colors">
                  Robo Advisory & Rebalancing
                </Link>
              </li>
              <li>
                <Link href="/solutions/financial-websites" className="hover:text-gold transition-colors">
                  Distributor Financial Websites
                </Link>
              </li>
              <li>
                <Link href="/solutions/crm" className="hover:text-gold transition-colors">
                  WhatsApp Automation CRM
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-gold transition-colors">
                  All 12 Platform Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-gold transition-colors">
                  Plans & Pricing Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Calculators & Tools */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-gold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rotate-45 bg-gold inline-block" />
              Advisory Calculators
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/calculators?tab=sip" className="hover:text-gold transition-colors">
                  SIP & Step-Up Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators?tab=lumpsum" className="hover:text-gold transition-colors">
                  Lumpsum Growth Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators?tab=swp" className="hover:text-gold transition-colors">
                  SWP Cashflow Planner
                </Link>
              </li>
              <li>
                <Link href="/calculators?tab=goal" className="hover:text-gold transition-colors">
                  Goal GPS Planner
                </Link>
              </li>
              <li>
                <Link href="/calculators?tab=retirement" className="hover:text-gold transition-colors">
                  Retirement Corpus Estimator
                </Link>
              </li>
              <li>
                <Link href="/calculators?tab=brokerage" className="hover:text-gold transition-colors">
                  MFD Trail Brokerage Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators?tab=tax" className="hover:text-gold transition-colors">
                  12.5% LTCG & 20% STCG Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/fund-explorer" className="hover:text-gold transition-colors font-semibold text-brand-teal">
                  Explore AMFI Mutual Funds →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Portals & Legal */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-gold uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rotate-45 bg-gold inline-block" />
              Client Portals & Legal
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/auth/login?role=INVESTOR" className="hover:text-gold transition-colors">
                  Investor Portal Login
                </Link>
              </li>
              <li>
                <Link href="/auth/login?role=ADVISOR" className="hover:text-gold transition-colors">
                  Advisor / IFA Portal Login
                </Link>
              </li>
              <li>
                <Link href="/auth/login?role=ADMIN" className="hover:text-gold transition-colors">
                  Super Admin Console
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Portfolio Pro
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-gold transition-colors">
                  Careers & Openings
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-gold transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-gold transition-colors">
                  Regulatory Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Compliance & Statutory Footer */}
        <div className="pt-8 pb-4 text-xs text-gray-400 space-y-3">
          <div className="flex items-start gap-2 bg-navy p-3.5 rounded border border-navy-light text-gray-300">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-white">{getComplianceTextDisplay()}</p>
              <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans font-medium">
                {TRADING_CONFIG.statutoryRiskDisclaimer}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-gray-500">
            <p>
              © {currentYear} {siteConfig.companyName}. All rights reserved.
            </p>
            <p className="flex items-center gap-3">
              <span>ISO 27001 Certified Security</span>
              <span>•</span>
              <span>SEBI & AMFI Circular Aligned</span>
              <span>•</span>
              <span>Tier-4 India Datacenter</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

