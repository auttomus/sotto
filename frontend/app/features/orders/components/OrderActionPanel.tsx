import * as React from "react";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { OrderStatus } from "~/core/apollo/base-types";
import { Button } from "~/components/ui/Button";

interface OrderActionPanelProps {
  status: OrderStatus;
  isBuyer: boolean;
  isActionLoading: boolean;
  isPaying?: boolean;
  handleAdvance: () => void;
  handleCancel: () => void;
  onPay?: () => void;
}

export function OrderActionPanel({
  status,
  isBuyer,
  isActionLoading,
  isPaying = false,
  handleAdvance,
  handleCancel,
  onPay,
}: OrderActionPanelProps) {
  // 1. Order sedang aktif dikerjakan (Buyer dapat menyelesaikan / membatalkan)
  if (status === OrderStatus.InProgress && isBuyer) {
    return (
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-safe shrink-0 shadow-lg">
        <div className="flex items-start gap-2 mb-3.5 px-1 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
          <p className="leading-normal">
            Dengan menandai pesanan sebagai Selesai, dana escrow akan otomatis dirilis ke saldo penjual dan transaksi tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 font-bold text-xs py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer disabled:opacity-50"
            onClick={handleCancel}
            disabled={isActionLoading}
          >
            Batalkan
          </Button>
          <Button
            variant="primary"
            className="flex-1 font-bold text-xs py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-600/10 hover:shadow-green-600/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            onClick={handleAdvance}
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Pesanan Selesai</span>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // 2. Order sedang menunggu pembayaran
  if (status === OrderStatus.PendingPayment) {
    return (
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-safe shrink-0 shadow-lg space-y-3">
        {isBuyer && onPay && (
          <div className="flex items-center gap-2 px-1 text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Pembayaran Escrow Terjamin & Aman</span>
          </div>
        )}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 font-bold text-xs py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer disabled:opacity-50"
            onClick={handleCancel}
            disabled={isActionLoading || isPaying}
          >
            Batalkan Order
          </Button>

          {isBuyer && onPay && (
            <Button
              variant="primary"
              className="flex-[2] font-extrabold text-xs py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              onClick={onPay}
              disabled={isActionLoading || isPaying}
            >
              {isPaying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyiapkan...</span>
                </>
              ) : (
                <span>Bayar Sekarang (Midtrans)</span>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
