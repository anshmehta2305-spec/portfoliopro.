import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, required, hint, children, className = "" }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="font-sans text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-600">*</span>}
        </span>
        {hint && <span className="text-[11px] font-normal text-charcoal-soft lowercase">{hint}</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-600 font-medium mt-0.5">{error}</span>}
    </div>
  );
}

