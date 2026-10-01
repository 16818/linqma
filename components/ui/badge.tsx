import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "navy" | "success" | "crown";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-cream-dark text-navy",
    gold: "bg-gold/15 text-gold-dark border border-gold/30",
    navy: "bg-navy text-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    crown:
      "bg-gradient-to-l from-gold to-[#F5D76E] text-navy font-bold shadow-sm border border-gold/40",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };