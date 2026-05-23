import * as React from "react";
import { useGetMyOrdersQuery } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";

export type OrderRole = "ALL" | "BUYER" | "SELLER";

export function useMyOrders() {
  const { user } = useAuthStore();
  const [role, setRole] = React.useState<OrderRole>("ALL");

  // Fetch buyer orders if role is ALL or BUYER
  const { data: buyerData, loading: buyerLoading, error: buyerError } = useGetMyOrdersQuery({
    variables: { role: "buyer" },
    fetchPolicy: "cache-and-network",
    skip: role === "SELLER",
  });

  // Fetch seller orders if role is ALL or SELLER
  const { data: sellerData, loading: sellerLoading, error: sellerError } = useGetMyOrdersQuery({
    variables: { role: "seller" },
    fetchPolicy: "cache-and-network",
    skip: role === "BUYER",
  });

  const loading = buyerLoading || sellerLoading;
  const error = buyerError || sellerError;

  const orders = React.useMemo(() => {
    const buyerOrders = role !== "SELLER" ? (buyerData?.myOrders || []) : [];
    const sellerOrders = role !== "BUYER" ? (sellerData?.myOrders || []) : [];
    
    if (role === "ALL") {
      // Merge and deduplicate by id, sort by createdAt desc
      const map = new Map<string, any>();
      [...buyerOrders, ...sellerOrders].forEach((o) => map.set(o.id, o));
      return Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return role === "BUYER" ? buyerOrders : sellerOrders;
  }, [role, buyerData, sellerData]);

  return {
    role,
    setRole,
    orders,
    loading,
    error,
    user,
  };
}
