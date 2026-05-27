import * as React from "react";
import { cn } from "../../core/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-secondary text-secondary-foreground border border-border",
    success: "bg-success/15 text-success border border-success/20",
    warning: "bg-warning/15 text-warning border border-warning/20",
    danger: "bg-destructive/15 text-destructive border border-destructive/20",
    outline: "border border-border text-muted-foreground bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
