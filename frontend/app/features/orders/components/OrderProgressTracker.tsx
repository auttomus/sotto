import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { OrderStatus } from "~/core/apollo/base-types";

interface OrderProgressTrackerProps {
  status: OrderStatus;
}

export function OrderProgressTracker({ status }: OrderProgressTrackerProps) {
  const isCancelled = status === OrderStatus.Cancelled;

  const steps = [
    {
      id: "paid",
      label: "Dibayar",
      done: [OrderStatus.InProgress, OrderStatus.Completed].includes(status),
      active: status === OrderStatus.PendingPayment,
    },
    {
      id: "working",
      label: "Dikerjakan",
      done: status === OrderStatus.Completed,
      active: status === OrderStatus.InProgress,
    },
    {
      id: "completed",
      label: "Selesai",
      done: status === OrderStatus.Completed,
      active: false,
    },
  ];

  if (isCancelled) {
    return (
      <div className="px-6 py-4 pb-5 bg-destructive/10 border-b border-destructive/20 flex justify-center">
        <span className="text-xs font-bold text-destructive tracking-wide uppercase">
          Pesanan Ini Telah Dibatalkan
        </span>
      </div>
    );
  }

  const activeWidth =
    status === OrderStatus.Completed
      ? "100%"
      : status === OrderStatus.InProgress
      ? "50%"
      : "0%";

  return (
    <div className="px-6 py-4 pb-6">
      <div className="relative flex items-center justify-between w-full">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full z-0"></div>
        {/* Active Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500"
          style={{ width: activeWidth }}
        ></div>

        {/* Steps */}
        {steps.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                step.done
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.active
                  ? "bg-card border-primary text-primary ring-4 ring-primary/20"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {step.done ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <span className="text-[10px] font-bold">{idx + 1}</span>
              )}
            </div>
            <span
              className={`absolute -bottom-5 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                step.done || step.active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
