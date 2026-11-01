import React from "react";

interface HeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  theme?: "dark" | "light";
  className?: string;
  titleTag?: "h1" | "h2" | "h3" | "h4";
}

export function Heading({
  badge,
  title,
  subtitle,
  align = "center",
  theme = "light",
  className = "",
  titleTag = "h2",
}: HeadingProps) {
  const isDark = theme === "dark";
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  const TitleTag = titleTag;

  return (
    <div className={`flex flex-col mb-12 ${alignClass} ${className}`}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase rounded-[2px] bg-gold/15 text-gold border border-gold/30">
          {badge}
        </span>
      )}
      <TitleTag
        className={`font-serif tracking-tight leading-tight ${
          titleTag === "h1"
            ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
            : titleTag === "h2"
            ? "text-2xl sm:text-3xl md:text-4xl font-bold"
            : "text-xl sm:text-2xl font-semibold"
        } ${isDark ? "text-white" : "text-navy"}`}
      >
        {title}
      </TitleTag>

      {/* Elegant thin gold divider */}
      <div className={`flex items-center gap-2 my-4 ${align === "center" ? "justify-center" : ""}`}>
        <div className="w-12 h-[1px] bg-gold/70" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold" />
        <div className="w-12 h-[1px] bg-gold/70" />
      </div>

      {subtitle && (
        <p
          className={`max-w-2xl font-sans text-base sm:text-lg leading-relaxed ${
            isDark ? "text-gray-300" : "text-charcoal-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

