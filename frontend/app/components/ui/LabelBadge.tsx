import * as React from "react";
import { cn } from "~/core/utils/cn";

export type LabelBadgeVariant =
  | "tag"
  | "listing-product"
  | "listing-service"
  | "school"
  | "order-status"
  | "offer-status";

export interface LabelBadgeProps {
  variant: LabelBadgeVariant;
  value: string; // The text content or status key
  className?: string;
  icon?: React.ReactNode;
}

export function LabelBadge({ variant, value, className, icon }: LabelBadgeProps) {
  // Pre-process status keys to display labels
  let displayValue = value;
  let colorClasses = "";

  // Common styling for tags, school, listing types, status etc.
  const baseClasses = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all duration-200";

  switch (variant) {
    case "tag":
      // Tags are prefix `#`
      displayValue = value.startsWith("#") ? value : `#${value}`;
      colorClasses = "bg-primary/10 text-primary border-primary/20";
      break;

    case "listing-product":
      displayValue = "PRODUK";
      colorClasses = "bg-success/10 text-success border-success/20";
      break;

    case "listing-service":
      displayValue = "JASA";
      colorClasses = "bg-accent text-accent-foreground border-accent-foreground/20";
      break;

    case "school":
      // School affiliations
      colorClasses = "bg-secondary text-muted-foreground border-border normal-case";
      break;

    case "order-status":
      switch (value) {
        case "COMPLETED":
          displayValue = "Selesai";
          colorClasses = "text-success bg-success/10 border-success/20";
          break;
        case "IN_PROGRESS":
          displayValue = "Dikerjakan";
          colorClasses = "text-warning bg-warning/10 border-warning/20";
          break;
        case "PENDING_PAYMENT":
          displayValue = "Menunggu Bayar";
          colorClasses = "text-primary bg-primary/10 border-primary/20";
          break;
        case "CANCELLED":
          displayValue = "Dibatalkan";
          colorClasses = "text-destructive bg-destructive/10 border-destructive/20";
          break;
        default:
          displayValue = value;
          colorClasses = "text-muted-foreground bg-secondary border-border";
      }
      break;

    case "offer-status":
      switch (value) {
        case "ACCEPTED":
          displayValue = "Diterima";
          colorClasses = "text-success bg-success/10 border-success/20";
          break;
        case "PENDING":
          displayValue = "Menunggu";
          colorClasses = "text-warning bg-warning/10 border-warning/20";
          break;
        case "REJECTED":
          displayValue = "Ditolak";
          colorClasses = "text-destructive bg-destructive/10 border-destructive/20";
          break;
        default:
          displayValue = value;
          colorClasses = "text-muted-foreground bg-secondary border-border";
      }
      break;
  }

  return (
    <span className={cn(baseClasses, colorClasses, className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      {displayValue}
    </span>
  );
}
