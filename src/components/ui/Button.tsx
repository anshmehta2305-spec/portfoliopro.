import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "navy" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-semibold tracking-wide transition-all duration-200 rounded-[3px] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gold/50";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const variantClasses = {
    // Primary: Logo Blue with Gold Accent on Hover
    primary:
      "bg-brand-blue text-white hover:bg-navy hover:text-gold-light shadow-classic active:translate-y-px border border-transparent",
    // Navy: Deep Classic Private Bank Button
    navy: "bg-navy text-white hover:bg-brand-blue hover:text-white border border-navy shadow-classic active:translate-y-px",
    // Secondary / Gold Outline
    secondary:
      "bg-transparent text-navy border border-gold hover:bg-gold/10 hover:border-gold-dark active:translate-y-px",
    // Solid Gold
    gold: "bg-gold text-navy font-bold hover:bg-gold-light active:translate-y-px shadow-classic",
    // Clean Outline
    outline:
      "bg-transparent text-charcoal border border-rule hover:border-navy hover:text-navy active:translate-y-px",
    // Ghost
    ghost: "bg-transparent text-navy hover:bg-black/5",
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}

