import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-navy text-white hover:bg-navy-light shadow-soft",
      secondary: "bg-cream-dark text-navy hover:bg-[#E5DFD3]",
      outline: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
      ghost: "text-navy hover:bg-cream-dark",
      gold: "bg-gold text-navy font-semibold hover:bg-gold-dark shadow-soft",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm rounded-xl",
      md: "h-11 px-6 text-base rounded-2xl",
      lg: "h-13 px-8 text-lg rounded-2xl",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };