"use client";

import React from "react";
import { Download, Printer } from "lucide-react";

interface PrintButtonProps {
  label?: string;
  icon?: "download" | "printer";
  className?: string;
}

export function PrintButton({
  label = "Download / Print",
  icon = "printer",
  className = "",
}: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy text-white rounded text-xs font-semibold hover:bg-gold hover:text-navy transition-colors ${className}`}
    >
      {icon === "printer" ? <Printer className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
}

