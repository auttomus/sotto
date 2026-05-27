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
        <div className="bg-primary/10 border border-primary/20 rounded-md p-4 flex gap-3 animate-fade-in">
          <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-foreground text-sm">Menunggu Pembayaran</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {isBuyer
                ? "Silakan klik tombol 'Bayar Sekarang' di bawah untuk menyelesaikan pembayaran via Midtrans Sandbox."
                : "Menunggu pembeli menyelesaikan proses pembayaran. Proses pengerjaan akan dimulai otomatis setelah dibayar."}
            </p>
          </div>
        </div>
      );

    case OrderStatus.InProgress:
      return (
        <div className="bg-warning/10 border border-warning/20 rounded-md p-4 flex gap-3 animate-fade-in">
          <Clock className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-foreground text-sm">
              {isBuyer ? "Pesanan Sedang Diproses" : "Pesanan Aktif"}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {isBuyer
                ? "Penjual sedang mengerjakan pesanan Anda. Anda dapat berkoordinasi melalui ruang obrolan."
                : "Order telah dibayar. Silakan kerjakan pesanan ini dan hubungi pembeli untuk deliverables produk/jasa."}
            </p>
          </div>
        </div>
      );

    case OrderStatus.Completed:
      return (
        <div className="bg-success/10 border border-success/20 rounded-md p-4 flex gap-3 animate-fade-in">
          <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-foreground text-sm">Pesanan Selesai</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {isBuyer
                ? "Transaksi sukses. Dana escrow telah dilepaskan ke saldo penjual secara aman."
                : "Kerja bagus! Pembeli telah mengonfirmasi penyelesaian pesanan. Dana telah masuk ke saldo akun Anda."}
            </p>
          </div>
        </div>
      );

    case OrderStatus.Cancelled:
      return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex gap-3 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-foreground text-sm">Pesanan Dibatalkan</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
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
