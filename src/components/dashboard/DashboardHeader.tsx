"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LogOut, ShieldCheck, User, Bell, Clock } from "lucide-react";

interface DashboardHeaderProps {
  roleName: string;
  userName: string;
  subTitle?: string;
}

export function DashboardHeader({ roleName, userName, subTitle }: DashboardHeaderProps) {
  return (
    <header className="bg-navy text-white border-b-2 border-gold shadow-classic sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo on Navy */}
        <div className="flex items-center gap-4">
          <BrandLogo theme="dark" showTagline />
          <div className="hidden sm:block h-6 w-px bg-navy-light" />
          <span className="hidden sm:inline-block text-xs font-serif font-bold text-gold uppercase tracking-wider">
            {roleName} Console
          </span>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-bold text-white font-sans">{userName}</span>
            <span className="text-[10px] text-gray-400 font-mono">{subTitle || roleName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/40">
              {roleName}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-light text-gray-300 hover:text-white hover:bg-navy-dark rounded border border-navy-light transition-colors text-xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-gold" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

