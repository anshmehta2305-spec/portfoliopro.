"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BrandEmblemProps {
  size?: number;
  className?: string;
  isSpinning?: boolean;
}

export function BrandEmblem({ size = 34, className = "", isSpinning = false }: BrandEmblemProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 ${
        isSpinning ? "animate-pulse" : ""
      } ${className}`}
    >
      {!imgError ? (
        <Image
          src="/brand/emblem.png"
          alt="Portfolio Pro Emblem"
          width={size}
          height={size}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
          priority
        />
      ) : (
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F58AF" />
              <stop offset="100%" stopColor="#00BDD0" />
            </linearGradient>
            <linearGradient id="emblemGold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B08D57" />
              <stop offset="100%" stopColor="#C5A46D" />
            </linearGradient>
          </defs>

          <rect x="6" y="6" width="88" height="88" rx="18" fill="#0B1F3A" stroke="#B08D57" strokeWidth="2.5" />
          <path d="M 28 24 L 28 76" stroke="url(#emblemGrad)" strokeWidth="10" strokeLinecap="round" />
          <path
            d="M 28 24 C 54 24, 66 32, 66 45 C 66 58, 54 66, 28 66"
            stroke="url(#emblemGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="40" y="44" width="5.5" height="14" rx="2" fill="url(#emblemGrad)" />
          <rect x="49" y="36" width="5.5" height="22" rx="2" fill="url(#emblemGrad)" />
          <rect x="58" y="28" width="5.5" height="30" rx="2" fill="url(#emblemGold)" />
          <polygon points="60.5,21 62,24 65,24.5 62.5,27 63,30 60.5,28 58,30 58.5,27 56,24.5 59,24" fill="#B08D57" />
        </svg>
      )}
    </div>
  );
}
