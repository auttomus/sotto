import * as React from "react";
import { ArrowLeft, CheckCircle2, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/Button";
import { useGetOrderDetailQuery, useAdvanceOrderStatusMutation, useCancelOrderMutation } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useToastStore } from "~/core/store/useToastStore";

export default function OrderRoute() {
  const { orderId } = useParams();
  const { user } = useAuthStore();
  const addToast = useToastStore(s => s.addToast);
  
  const { data, loading, error, refetch } = useGetOrderDetailQuery({
    variables: { id: orderId as string },
    skip: !orderId,
    fetchPolicy: "cache-and-network"
  });

  const [advanceOrder, { loading: advanceLoading }] = useAdvanceOrderStatusMutation({
    onCompleted: () => {
      addToast('success', 'Status order berhasil diperbarui');
      refetch();
    },
    onError: (e: any) => addToast('error', e.message),
  });

  const [cancelOrder, { loading: cancelLoading }] = useCancelOrderMutation({
    onCompleted: () => {
      addToast('success', 'Order berhasil dibatalkan');
      refetch();
    },
    onError: (e: any) => addToast('error', e.message),
  });

  if (loading && !data) {
    return (
      <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 justify-center items-center p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order tidak ditemukan</h2>
        <Link to="/orders" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-4">
          Kembali ke daftar order
        </Link>
      </div>
    );
  }

  const order = data.order;
  const isBuyer = order.buyerAccountId === user?.accountId;
  const partnerLabel = isBuyer ? "Penjual" : "Pembeli";
  const isActionLoading = advanceLoading || cancelLoading;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED": return "Selesai";
      case "IN_PROGRESS": return "Dikerjakan";
      case "PENDING_PAYMENT": return "Menunggu Pembayaran";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  const handleAdvance = () => {
    advanceOrder({ variables: { orderId: order.id } });
  };

  const handleCancel = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan order ini?')) {
      cancelOrder({ variables: { orderId: order.id } });
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      {/* Header with Progress Tracker */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 sticky top-0 z-10">
        <div className="px-3 h-16 flex items-center gap-3">
          <Link to="/orders" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Pesanan #{order.id.slice(0, 8)}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">{isBuyer ? "Anda adalah Pembeli" : "Anda adalah Penjual"}</span>
          </div>
        </div>

        {/* Progress Tracker Bar */}
        <div className="px-6 py-4 pb-5">
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full z-0"></div>
            {/* Active Line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500"
              style={{ 
                width: order.status === 'COMPLETED' ? '100%' : 
                       order.status === 'IN_PROGRESS' ? '50%' : 
                       order.status === 'CANCELLED' ? '0%' : '0%'
              }}
            ></div>

            {/* Steps */}
            {[
              { id: "paid", label: "Dibayar", done: ['IN_PROGRESS', 'COMPLETED'].includes(order.status), active: order.status === 'PENDING_PAYMENT' },
              { id: "working", label: "Dikerjakan", done: order.status === 'COMPLETED', active: order.status === 'IN_PROGRESS' },
              { id: "completed", label: "Selesai", done: order.status === 'COMPLETED', active: false },
            ].map((step, idx) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.done 
                    ? "bg-indigo-500 border-indigo-500 text-white" 
                    : step.active 
                      ? "bg-white dark:bg-gray-900 border-indigo-500 text-indigo-500 ring-4 ring-indigo-500/20"
                      : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-300 dark:text-gray-700"
                }`}>
                  {step.done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </div>
                <span className={`absolute -bottom-5 text-[10px] font-semibold whitespace-nowrap ${
                  step.done || step.active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Order Details Card */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-3">Detail Pesanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{getStatusLabel(order.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Harga Disepakati</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Rp {order.agreedPrice?.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Peran Anda</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{isBuyer ? "Pembeli" : "Penjual"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Tanggal Order</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">ID Listing</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">{order.listingId.slice(0, 12)}...</span>
            </div>
          </div>
        </div>

        {/* Status Info Cards */}
        {order.status === 'PENDING_PAYMENT' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Menunggu Pembayaran</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                  Order sedang menunggu konfirmasi pembayaran sebelum dapat diproses.
                </p>
              </div>
            </div>
          </div>
        )}

        {order.status === 'IN_PROGRESS' && isBuyer && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-orange-900 dark:text-orange-100 text-sm">Sedang Dikerjakan</h4>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1 leading-relaxed">
                  Penjual sedang mengerjakan pesanan Anda. Silakan pantau progres melalui pesan.
                </p>
              </div>
            </div>
          </div>
        )}

        {order.status === 'IN_PROGRESS' && !isBuyer && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-orange-900 dark:text-orange-100 text-sm">Order Aktif</h4>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1 leading-relaxed">
                  Anda sedang mengerjakan order ini. Setelah selesai, pembeli akan mengonfirmasi hasilnya.
                </p>
              </div>
            </div>
          </div>
        )}

        {order.status === 'COMPLETED' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-green-900 dark:text-green-100 text-sm">Pesanan Selesai</h4>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1 leading-relaxed">
                  Pesanan ini telah diselesaikan. Dana telah diteruskan ke penjual.
                </p>
              </div>
            </div>
          </div>
        )}

        {order.status === 'CANCELLED' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-100 text-sm">Pesanan Dibatalkan</h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                  Pesanan ini telah dibatalkan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Board (Sticky Bottom) */}
      {order.status === 'IN_PROGRESS' && isBuyer && (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-safe shrink-0">
          <div className="flex items-start gap-2 mb-3 px-1 text-xs text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>Dengan menekan Pesanan Selesai, dana akan diteruskan ke penjual dan pesanan tidak dapat dibatalkan.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1 font-semibold"
              onClick={handleCancel}
              disabled={isActionLoading}
            >
              Batalkan
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 font-semibold bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-500/20"
              onClick={handleAdvance}
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Pesanan Selesai"}
            </Button>
          </div>
        </div>
      )}

      {order.status === 'PENDING_PAYMENT' && (
        <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 pb-safe shrink-0">
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1 font-semibold"
              onClick={handleCancel}
              disabled={isActionLoading}
            >
              {isActionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Batalkan Order"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
