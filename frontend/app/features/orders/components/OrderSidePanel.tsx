import * as React from "react";
import { useMyOrders } from "~/features/orders/hooks/useMyOrders";
import { OrderTimeline } from "~/features/orders/components/OrderTimeline";
import { Loader2 } from "lucide-react";

interface OrderSidePanelProps {
  activeOrderId?: string;
}

export function OrderSidePanel({ activeOrderId }: OrderSidePanelProps) {
  const { role, setRole, orders, loading, error, user } = useMyOrders();

  if (loading && !orders.length) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh] w-full bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-xs text-destructive w-full bg-background">
        Gagal memuat daftar order.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background border-r border-border overflow-y-auto">
      <OrderTimeline
        role={role}
        setRole={setRole}
        orders={orders}
        loading={loading}
        error={error}
        user={user}
        activeOrderId={activeOrderId}
      />
    </div>
  );
}
