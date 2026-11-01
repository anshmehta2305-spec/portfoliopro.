import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
  hoverEffect?: boolean;
  padded?: boolean;
}

export function Card({
  children,
  className = "",
  bordered = true,
  hoverEffect = false,
  padded = true,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-[3px] shadow-card ${
        bordered ? "border border-rule/80" : ""
      } ${
        hoverEffect
          ? "transition-all duration-200 hover:border-gold hover:shadow-classic-lg hover:-translate-y-0.5"
          : ""
      } ${padded ? "p-6 md:p-8" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

