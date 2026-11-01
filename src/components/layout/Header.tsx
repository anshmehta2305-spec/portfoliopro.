"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Shield, Lock, ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);

  const solutionsRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsDropdown(false);
      }
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setLoginDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.features, href: "/features" },
    {
      label: t.nav.solutions,
      href: "/solutions/investor-app",
      isDropdown: true,
      children: [
        { label: "Investor App & Portal", href: "/solutions/investor-app", desc: "White-label client app with biometric login" },
        { label: "Advisor Desk & Back-Office", href: "/solutions/advisor-app", desc: "Consolidated AUM, SIP book & transacting console" },
        { label: "Robo Advisory & Rebalancing", href: "/solutions/robo-advisory", desc: "Model portfolios & automated risk profiling" },
        { label: "Financial Websites for MFDs", href: "/solutions/financial-websites", desc: "Custom branded web presence with calculators" },
        { label: "Distributor CRM & Automation", href: "/solutions/crm", desc: "Lead pipeline & automated WhatsApp nudges" },
      ],
    },
    { label: t.nav.pricing, href: "/pricing" },
    { label: t.nav.calculators, href: "/calculators" },
    { label: t.nav.fundExplorer, href: "/fund-explorer" },
    { label: t.nav.testimonials, href: "/testimonials" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.contact, href: "/contact" },
    { label: t.nav.payOnline, href: "/pay-online" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-classic border-b-[2px] border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo (Displayed on Navy surface as required) */}
          <div className="flex-shrink-0">
            <BrandLogo theme="dark" showTagline />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 2xl:space-x-3 text-sm">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="relative" ref={solutionsRef}>
                    <button
                      onClick={() => setSolutionsDropdown(!solutionsDropdown)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 font-medium transition-colors hover:text-gold ${
                        pathname.startsWith("/solutions") ? "text-gold font-semibold" : "text-gray-200"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${solutionsDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {solutionsDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-navy-dark border border-gold/40 shadow-classic-lg rounded-[2px] p-2 z-50">
                        {link.children?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setSolutionsDropdown(false)}
                            className="block p-2.5 hover:bg-navy-light rounded transition-colors group"
                          >
                            <div className="font-semibold text-white group-hover:text-gold text-sm">
                              {sub.label}
                            </div>
                            <div className="text-xs text-gray-400 group-hover:text-gray-200 mt-0.5">
                              {sub.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 py-1.5 font-medium transition-colors hover:text-gold ${
                    isActive ? "text-gold font-semibold border-b border-gold" : "text-gray-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons (Login Dropdown & Book Demo) */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Login Dropdown for all 8 roles */}
            <div className="relative" ref={loginRef}>
              <button
                onClick={() => setLoginDropdown(!loginDropdown)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-navy-light border border-gold/40 rounded-[2px] hover:border-gold hover:text-gold transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-gold" />
                <span>{t.nav.login}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {loginDropdown && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-navy-dark border border-gold shadow-classic-lg rounded-[2px] p-2 z-50 max-h-[80vh] overflow-y-auto">
                  <div className="px-3 py-2 border-b border-navy-light text-[11px] font-bold text-gold uppercase tracking-wider">
                    Select Your Login Portal
                  </div>
                  {siteConfig.loginRoles.map((role) => (
                    <Link
                      key={role.id}
                      href={`/auth/login?role=${role.id}`}
                      onClick={() => setLoginDropdown(false)}
                      className="flex items-start justify-between p-2.5 hover:bg-navy-light rounded transition-colors group"
                    >
                      <div>
                        <div className="font-semibold text-white group-hover:text-gold text-xs">
                          {role.label}
                        </div>
                        <div className="text-[11px] text-gray-400 leading-tight mt-0.5">
                          {role.description}
                        </div>
                      </div>
                      <span className="text-[10px] bg-gold/15 text-gold px-1.5 py-0.5 rounded border border-gold/20 shrink-0 ml-2">
                        {role.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Request Demo CTA */}
            <Link
              href="/book-demo"
              className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy bg-gold hover:bg-gold-light rounded-[2px] shadow-classic transition-all"
            >
              Book a Demo
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <Link
              href="/auth/login"
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-navy-light border border-gold/40 rounded"
            >
              Login
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-dark border-t border-navy-light px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            if (link.isDropdown) {
              return (
                <div key={link.label} className="py-1">
                  <div className="text-xs uppercase tracking-wider text-gold font-bold px-3 py-1">
                    {link.label}
                  </div>
                  <div className="pl-3 space-y-1 mt-1">
                    {link.children?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-3 py-1.5 text-sm text-gray-300 hover:text-gold"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-gray-200 hover:text-gold hover:bg-navy-light rounded"
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-navy-light space-y-2">
            <div className="text-xs font-bold text-gold uppercase px-3">Role Login Portals:</div>
            <div className="grid grid-cols-2 gap-1 px-2">
              {siteConfig.loginRoles.map((role) => (
                <Link
                  key={role.id}
                  href={`/auth/login?role=${role.id}`}
                  className="px-2 py-1.5 text-xs text-gray-300 hover:text-white bg-navy rounded border border-navy-light text-center"
                >
                  {role.label}
                </Link>
              ))}
            </div>
            <Link
              href="/book-demo"
              className="block w-full text-center py-2.5 text-sm font-bold uppercase tracking-wider bg-gold text-navy rounded"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

