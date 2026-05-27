import * as React from "react";
import { useMyOrders } from "~/features/orders/hooks/useMyOrders";
import { OrderTimeline } from "~/features/orders/components/OrderTimeline";

export default function OrdersRoute() {
  const { role, setRole, orders, loading, error, user } = useMyOrders();

  return (
    <OrderTimeline
      role={role}
      setRole={setRole}
      orders={orders}
      loading={loading}
      error={error}
      user={user}
    />
  );
}
