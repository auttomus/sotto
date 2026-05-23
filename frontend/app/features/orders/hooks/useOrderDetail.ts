import * as React from "react";
import { useGetOrderDetailQuery, useAdvanceOrderStatusMutation, useCancelOrderMutation } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";

interface UseOrderDetailOptions {
  orderId: string;
}

export function useOrderDetail({ orderId }: UseOrderDetailOptions) {
  const { user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  const { data, loading, error, refetch } = useGetOrderDetailQuery({
    variables: { id: orderId },
    skip: !orderId,
    fetchPolicy: "cache-and-network",
  });

  const [advanceOrder, { loading: advanceLoading }] = useAdvanceOrderStatusMutation({
    onCompleted: () => {
      addToast("success", "Status order berhasil diperbarui");
      refetch();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const [cancelOrder, { loading: cancelLoading }] = useCancelOrderMutation({
    onCompleted: () => {
      addToast("success", "Order berhasil dibatalkan");
      refetch();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const order = data?.order;
  const isBuyer = order?.buyerAccountId === user?.accountId;
  const partnerLabel = isBuyer ? "Penjual" : "Pembeli";
  const isActionLoading = advanceLoading || cancelLoading;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Selesai";
      case "IN_PROGRESS":
        return "Dikerjakan";
      case "PENDING_PAYMENT":
        return "Menunggu Pembayaran";
      case "CANCELLED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const handleAdvance = () => {
    if (order) {
      advanceOrder({ variables: { orderId: order.id } });
    }
  };

  const handleCancel = () => {
    if (order && confirm("Apakah Anda yakin ingin membatalkan order ini?")) {
      cancelOrder({ variables: { orderId: order.id } });
    }
  };

  return {
    order,
    loading,
    error,
    isBuyer,
    partnerLabel,
    isActionLoading,
    getStatusLabel,
    handleAdvance,
    handleCancel,
    refetch,
  };
}
