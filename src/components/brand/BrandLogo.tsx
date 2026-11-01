"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandEmblem } from "./BrandEmblem";

interface BrandLogoProps {
  theme?: "dark" | "light"; // 'dark' = for dark navy background (white text); 'light' = for light background (navy text)
  className?: string;
  showTagline?: boolean;
  href?: string;
}

export function BrandLogo({ theme = "dark", className = "", showTagline = false, href = "/" }: BrandLogoProps) {
  // If the user places their custom logo.png in public/brand/logo.png, Next.js Image will attempt to load it.
  // If it fails or is missing, fallback cleanly to our handcrafted SVG / text emblem.
  const [imgError, setImgError] = useState(false);

  const logoSrc = theme === "dark" ? "/brand/logo.png" : "/brand/logo-dark.png";

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* If custom PNG exists, render it. If not or error, show SVG text fallback */}
      {!imgError ? (
        <Image
          src={logoSrc}
          alt="Portfolio Pro"
          width={220}
          height={52}
          className="h-10 sm:h-11 w-auto object-contain"
          onError={() => setImgError(true)}
          priority
        />
      ) : (
        <div className="flex items-center gap-2.5">
          <BrandEmblem size={34} />
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span
                className={`font-serif text-2xl font-bold tracking-tight ${
                  theme === "dark" ? "text-white" : "text-navy"
                }`}
              >
                Portfolio
              </span>
              <span className="font-sans text-2xl font-extrabold text-brand-blue ml-0.5 tracking-tight">
                Pro
              </span>
            </div>
            {showTagline && (
              <span className="font-sans text-[9px] uppercase tracking-widest text-gold -mt-1 font-semibold">
                Wealth Technology
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}

