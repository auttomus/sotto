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
      <div className="px-6 py-4 pb-5 bg-red-50/20 border-b border-red-100/50 dark:bg-red-950/5 dark:border-red-900/10 flex justify-center">
        <span className="text-xs font-bold text-red-600 dark:text-red-400 tracking-wide uppercase">
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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full z-0"></div>
        {/* Active Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500"
          style={{ width: activeWidth }}
        ></div>

        {/* Steps */}
        {steps.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                step.done
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : step.active
                  ? "bg-white dark:bg-gray-900 border-indigo-500 text-indigo-500 ring-4 ring-indigo-500/20"
                  : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-700"
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
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 dark:text-gray-500"
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
