import * as React from "react";
import { useMyOrders } from "~/features/orders/hooks/useMyOrders";
import { OrderTimeline } from "~/features/orders/components/OrderTimeline";
import { Loader2, ClipboardList } from "lucide-react";

export default function OrdersRoute() {
  const { role, setRole, orders, loading, error, user } = useMyOrders();

  if (loading && !orders.length) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Gagal memuat daftar order.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Column (Daftar Order) */}
      <div className="w-full md:w-[350px] lg:w-[380px] h-full flex-shrink-0 flex flex-col border-r border-border bg-background overflow-hidden">
        <OrderTimeline
          role={role}
          setRole={setRole}
          orders={orders}
          loading={loading}
          error={error}
          user={user}
        />
      </div>

      {/* Right Column (Placeholder Kosong Desktop) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-card/30">
        <div className="max-w-sm space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-sm">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Kelola Transaksi Anda</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pilih salah satu order di sebelah kiri untuk melihat detail pesanan, memantau kemajuan pengerjaan, atau melakukan pembayaran.
          </p>
        </div>
      </div>
    </div>
  );
}
