import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { useOrderDetail } from "~/features/orders/hooks/useOrderDetail";
import { OrderProgressTracker } from "~/features/orders/components/OrderProgressTracker";
import { OrderDetailCard } from "~/features/orders/components/OrderDetailCard";
import { OrderStatusAlert } from "~/features/orders/components/OrderStatusAlert";
import { OrderActionPanel } from "~/features/orders/components/OrderActionPanel";

export default function OrderRoute() {
  const { orderId } = useParams();

  // Load all logic, state, dynamic Midtrans snap, and nested listing details via hook
  const {
    order,
    loading,
    error,
    isBuyer,
    isActionLoading,
    isPaying,
    getStatusLabel,
    handleAdvance,
    handleCancel,
    handlePay,
  } = useOrderDetail({ orderId: orderId as string });

  if (loading && !order) {
    return (
      <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 justify-center items-center p-4 text-center">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Order Tidak Ditemukan</h2>
        <Link to="/orders" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline mt-4 text-sm">
          Kembali ke daftar order
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      {/* Header navigasi */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 sticky top-0 z-10">
        <div className="px-3 h-16 flex items-center gap-3">
          <Link to="/orders" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">
              Pesanan #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {isBuyer ? "Pembeli (Buyer)" : "Penjual (Seller)"}
            </span>
          </div>
        </div>

        {/* Progress Tracker modular */}
        <OrderProgressTracker status={order.status} />
      </header>

      {/* Konten Utama */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Banner Alert Status */}
        <OrderStatusAlert status={order.status} isBuyer={isBuyer} />

        {/* Detail Pembayaran & Produk */}
        <OrderDetailCard
          order={order}
          isBuyer={isBuyer}
          getStatusLabel={getStatusLabel}
        />
      </div>

      {/* Control Action Panel (Sticky Bottom) */}
      <OrderActionPanel
        status={order.status}
        isBuyer={isBuyer}
        isActionLoading={isActionLoading}
        isPaying={isPaying}
        handleAdvance={handleAdvance}
        handleCancel={handleCancel}
        onPay={handlePay}
      />
    </div>
  );
}

