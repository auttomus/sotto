import * as React from "react";
import { useParams } from "react-router";
import { OrderDetailView } from "~/features/orders/components/OrderDetailView";

export default function OrderRoute() {
  const { orderId } = useParams();

  return <OrderDetailView orderId={orderId as string} />;
}
