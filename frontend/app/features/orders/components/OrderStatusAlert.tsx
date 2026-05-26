import * as React from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { OrderStatus } from "~/core/apollo/base-types";

interface OrderStatusAlertProps {
  status: OrderStatus;
  isBuyer: boolean;
}

export function OrderStatusAlert({ status, isBuyer }: OrderStatusAlertProps) {
  switch (status) {
    case OrderStatus.PendingPayment:
      return (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100/70 dark:border-blue-900/30 rounded-3xl p-4 flex gap-3 animate-fade-in">
          <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-blue-950 dark:text-blue-200 text-sm">Menunggu Pembayaran</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
              {isBuyer
                ? "Silakan klik tombol 'Bayar Sekarang' di bawah untuk menyelesaikan pembayaran via Midtrans Sandbox."
                : "Menunggu pembeli menyelesaikan proses pembayaran. Proses pengerjaan akan dimulai otomatis setelah dibayar."}
            </p>
          </div>
        </div>
      );

    case OrderStatus.InProgress:
      return (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100/70 dark:border-amber-900/30 rounded-3xl p-4 flex gap-3 animate-fade-in">
          <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">
              {isBuyer ? "Pesanan Sedang Diproses" : "Pesanan Aktif"}
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
              {isBuyer
                ? "Penjual sedang mengerjakan pesanan Anda. Anda dapat berkoordinasi melalui ruang obrolan."
                : "Order telah dibayar. Silakan kerjakan pesanan ini dan hubungi pembeli untuk deliverables produk/jasa."}
            </p>
          </div>
        </div>
      );

    case OrderStatus.Completed:
      return (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100/70 dark:border-green-900/30 rounded-3xl p-4 flex gap-3 animate-fade-in">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-green-950 dark:text-green-200 text-sm">Pesanan Selesai</h4>
            <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed font-medium">
              {isBuyer
                ? "Transaksi sukses. Dana escrow telah dilepaskan ke saldo penjual secara aman."
                : "Kerja bagus! Pembeli telah mengonfirmasi penyelesaian pesanan. Dana telah masuk ke saldo akun Anda."}
            </p>
          </div>
        </div>
      );

    case OrderStatus.Cancelled:
      return (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100/70 dark:border-red-900/30 rounded-3xl p-4 flex gap-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-red-950 dark:text-red-200 text-sm">Pesanan Dibatalkan</h4>
            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed font-medium">
              {isBuyer
                ? "Pesanan telah dibatalkan secara permanen. Jika ada dana yang terdebit, dana akan dikembalikan ke instrumen asal."
                : "Pesanan ini telah dibatalkan. Hubungi admin atau pembeli jika terjadi perselisihan."}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
