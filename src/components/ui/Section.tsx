import React from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  background?: "ivory" | "white" | "navy" | "subtle";
  withOrnament?: boolean;
}

export function Section({
  id,
  children,
  className = "",
  background = "ivory",
  withOrnament = false,
}: SectionProps) {
  const bgClasses = {
    ivory: "bg-ivory text-charcoal",
    white: "bg-white text-charcoal",
    navy: "bg-navy text-white",
    subtle: "bg-ivory-dark/40 text-charcoal",
  };

  return (
    <section id={id} className={`py-16 md:py-24 relative ${bgClasses[background]} ${className}`}>
      {withOrnament && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="w-16 h-px bg-gold/50" />
          <div className="w-2.5 h-2.5 rotate-45 border border-gold bg-ivory" />
          <div className="w-16 h-px bg-gold/50" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

