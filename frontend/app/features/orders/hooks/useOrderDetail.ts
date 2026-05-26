import * as React from "react";
import { 
  useGetOrderDetailQuery, 
  useAdvanceOrderStatusMutation, 
  useCancelOrderMutation,
  useGetMidtransSnapTokenMutation,
  useGetListingDetailQuery
} from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";

interface UseOrderDetailOptions {
  orderId: string;
}

export function useOrderDetail({ orderId }: UseOrderDetailOptions) {
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
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "";
    script.setAttribute("data-client-key", clientKey);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [order?.status, isBuyer]);

  // 4. Mutasi untuk mendapatkan Midtrans Snap Token secara dinamis
  const [getSnapToken, { loading: isPaying }] = useGetMidtransSnapTokenMutation({
    onCompleted: (res) => {
      const token = res.getMidtransSnapToken;
      if (token && (window as any).snap) {
        (window as any).snap.pay(token, {
          onSuccess: (result: any) => {
            console.log("Midtrans Success:", result);
            addToast("success", "Pembayaran terverifikasi! Pesanan aktif.");
            window.location.reload();
          },
          onPending: (result: any) => {
            console.log("Midtrans Pending:", result);
            addToast("info", "Menunggu penyelesaian pembayaran.");
            window.location.reload();
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

  const handlePay = () => {
    if (orderId) {
      getSnapToken({ variables: { orderId } });
    }
  };

  // Gabungkan info listing ke objek order
  const orderWithListing = order
    ? {
        ...order,
        listing: listing ? { title: listing.title } : null,
      }
    : null;

  return {
    order: orderWithListing,
    loading,
    error,
    isBuyer,
    partnerLabel,
    isActionLoading,
    isPaying,
    getStatusLabel,
    handleAdvance,
    handleCancel,
    handlePay,
    refetch,
  };
}

