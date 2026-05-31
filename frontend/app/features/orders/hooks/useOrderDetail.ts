import * as React from "react";
import { 
  useGetOrderDetailQuery, 
  useAdvanceOrderStatusMutation, 
  useCancelOrderMutation,
  useGetMidtransSnapTokenMutation,
  useVerifyPaymentMutation,
  useGetListingDetailQuery,
  useCreateReviewMutation,
  useFileComplaintMutation,
  useRefundDisputedOrderMutation,
  useCreateConversationMutation
} from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";
import { useNavigate } from "react-router";
import { ROUTES } from "~/core/constants/ROUTES";

interface UseOrderDetailOptions {
  orderId: string;
}

export function useOrderDetail({ orderId }: UseOrderDetailOptions) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  // 1. Ambil detail order utama
  const { data, loading, error, refetch } = useGetOrderDetailQuery({
    variables: { id: orderId },
    skip: !orderId,
    fetchPolicy: "cache-and-network",
  });

  const order = data?.order;
  const isBuyer = order?.buyerAccountId === user?.accountId;
  const partnerLabel = isBuyer ? "Penjual" : "Pembeli";

  // 2. Ambil detail listing secara paralel untuk judul/deskripsi produk
  const listingId = order?.listingId || "";
  const { data: listingData } = useGetListingDetailQuery({
    variables: { id: listingId },
    skip: !listingId,
  });
  const listing = listingData?.listing;

  // 3. Muat Script Midtrans Snap secara dinamis hanya untuk halaman order (khusus Pembeli)
  React.useEffect(() => {
    if (order?.status !== "PENDING_PAYMENT" || !isBuyer) return;

    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = 
      (typeof window !== "undefined" && (window as any).ENV?.VITE_MIDTRANS_CLIENT_KEY) || 
      import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 
      "";
    script.setAttribute("data-client-key", clientKey);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [order?.status, isBuyer]);

  // 4. Mutasi verifikasi pembayaran langsung ke Midtrans Status API (fallback webhook)
  const [verifyPayment] = useVerifyPaymentMutation();

  // 5. Mutasi untuk mendapatkan Midtrans Snap Token secara dinamis
  const [getSnapToken, { loading: isPaying }] = useGetMidtransSnapTokenMutation({
    onCompleted: (res) => {
      const token = res.getMidtransSnapToken;
      if (token && (window as any).snap) {
        (window as any).snap.pay(token, {
          onSuccess: async (result: any) => {
            console.log("Midtrans Success:", result);
            addToast("success", "Pembayaran berhasil! Memverifikasi...");
            try {
              await verifyPayment({ variables: { orderId } });
            } catch (e) {
              console.error("Verify payment failed:", e);
            }
            refetch();
          },
          onPending: async (result: any) => {
            console.log("Midtrans Pending:", result);
            addToast("info", "Menunggu penyelesaian pembayaran...");
            try {
              await verifyPayment({ variables: { orderId } });
            } catch (e) {
              console.error("Verify payment failed:", e);
            }
            refetch();
          },
          onError: (result: any) => {
            console.error("Midtrans Error:", result);
            addToast("error", "Terjadi kesalahan saat transaksi.");
          },
          onClose: () => {
            console.log("Midtrans Popup closed");
          },
        });
      } else {
        addToast("error", "Gagal menginisialisasi pembayaran Midtrans.");
      }
    },
    onError: (err) => {
      addToast("error", `Gagal memproses pembayaran: ${err.message}`);
    },
  });

  // 5. Mutasi kemajuan status order (Advance Status)
  const [advanceOrder, { loading: advanceLoading }] = useAdvanceOrderStatusMutation({
    onCompleted: () => {
      addToast("success", "Status order berhasil diperbarui");
      refetch();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  // 6. Mutasi pembatalan order (Cancel Order)
  const [cancelOrder, { loading: cancelLoading }] = useCancelOrderMutation({
    onCompleted: () => {
      addToast("success", "Order berhasil dibatalkan");
      refetch();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const [createReview, { loading: reviewLoading }] = useCreateReviewMutation({
    onCompleted: () => {
      addToast("success", "Ulasan berhasil dikirim!");
      refetch();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  // 7. Mutasi pengajuan komplain (File Complaint)
  const [fileComplaint, { loading: complaintLoading }] = useFileComplaintMutation({
    onCompleted: () => {
      addToast("success", "Komplain berhasil diajukan");
      refetch();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  // 8. Mutasi setuju refund sengketa (Refund Disputed Order)
  const [refundDisputedOrder, { loading: refundDisputedLoading }] = useRefundDisputedOrderMutation({
    onCompleted: () => {
      addToast("success", "Refund berhasil disetujui. Dana dikembalikan.");
      refetch();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const [createConversation, { loading: chatLoading }] = useCreateConversationMutation({
    onCompleted: (res) => {
      const convoId = res.createConversation.id;
      const listingTitle = listing?.title || "Jasa/Produk";
      const shortOrderId = orderId.substring(0, 8).toUpperCase();
      const messageText = `Halo ${order?.seller?.displayName || "Penjual"}, saya ingin mengajukan permohonan pembatalan untuk pesanan #${shortOrderId} (${listingTitle}). Apakah kita bisa mendiskusikan hal ini?`;
      navigate(ROUTES.WORKSPACE_CHAT(convoId), {
        state: {
          initialMessage: messageText
        }
      });
    },
    onError: (err) => {
      addToast("error", `Gagal memulai chat: ${err.message}`);
    }
  });

  const handleRequestCancellationChat = () => {
    if (order?.sellerAccountId) {
      createConversation({
        variables: {
          input: {
            participantIds: [order.sellerAccountId],
            type: "DIRECT",
          }
        }
      });
    }
  };

  const isActionLoading = advanceLoading || cancelLoading || reviewLoading || complaintLoading || refundDisputedLoading || chatLoading;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Selesai";
      case "IN_PROGRESS":
        return "Dikerjakan";
      case "PENDING_PAYMENT":
        return "Menunggu Pembayaran";
      case "DELIVERED":
        return "Pekerjaan Dikirim";
      case "DISPUTED":
        return "Sengketa/Komplain";
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
    if (order) {
      cancelOrder({ variables: { orderId: order.id } });
    }
  };

  const handlePay = () => {
    if (orderId) {
      getSnapToken({ variables: { orderId } });
    }
  };

  const handleReview = async (rating: number, comment?: string) => {
    await createReview({
      variables: {
        orderId,
        rating,
        comment: comment || undefined,
      },
    });
  };

  // Gabungkan info listing ke objek order
  const orderWithListing = order
    ? {
        ...order,
        listing: listing 
          ? { 
              title: listing.title,
              type: listing.type,
              digitalFileObjectKey: listing.digitalFileObjectKey,
              digitalLink: listing.digitalLink,
            } 
          : null,
      }
    : null;

  const handleFileComplaint = (reason: string, notes?: string) => {
    if (order) {
      fileComplaint({ variables: { orderId: order.id, reason, notes } });
    }
  };

  const handleRefundDisputedOrder = () => {
    if (order) {
      refundDisputedOrder({ variables: { orderId: order.id } });
    }
  };

  return {
    order: orderWithListing,
    loading,
    error,
    isBuyer,
    partnerLabel,
    isActionLoading,
    reviewLoading,
    isPaying,
    getStatusLabel,
    handleAdvance,
    handleCancel,
    handlePay,
    handleReview,
    handleFileComplaint,
    handleRefundDisputedOrder,
    handleRequestCancellationChat,
    refetch,
  };
}

