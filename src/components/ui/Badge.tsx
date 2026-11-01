import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "navy" | "blue" | "teal" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "gold", size = "sm", className = "" }: BadgeProps) {
  const variantStyles = {
    gold: "bg-gold/15 text-gold-dark border-gold/40",
    navy: "bg-navy text-white border-navy",
    blue: "bg-brand-blue/10 text-brand-blue border-brand-blue/30",
    teal: "bg-brand-teal/15 text-brand-teal-dark border-brand-teal/40",
    neutral: "bg-ivory-dark text-charcoal border-rule",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center font-sans font-semibold uppercase tracking-wider rounded-[2px] border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

