import * as React from "react";
import { ArrowLeft, Loader2, Download, ExternalLink, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useDialogStore } from "~/core/store/useDialogStore";
import { useOrderDetail } from "~/features/orders/hooks/useOrderDetail";
import { OrderProgressTracker } from "~/features/orders/components/OrderProgressTracker";
import { OrderDetailCard } from "~/features/orders/components/OrderDetailCard";
import { OrderStatusAlert } from "~/features/orders/components/OrderStatusAlert";
import { OrderActionPanel } from "~/features/orders/components/OrderActionPanel";
import { OrderReviewSection } from "~/features/orders/components/OrderReviewSection";
import { OrderSidePanel } from "~/features/orders/components/OrderSidePanel";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface OrderDetailViewProps {
  orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const confirm = useDialogStore((s) => s.confirm);

  // Load all logic, state, dynamic Midtrans snap, and nested listing details via hook
  const {
    order,
    loading,
    error,
    isBuyer,
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
  } = useOrderDetail({ orderId });

  if (loading && !order) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <div className="hidden md:block w-[350px] lg:w-[380px] h-full flex-shrink-0 border-r border-border bg-background">
          <OrderSidePanel activeOrderId={orderId} />
        </div>
        <div className="flex-1 flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <div className="hidden md:block w-[350px] lg:w-[380px] h-full flex-shrink-0 border-r border-border bg-background">
          <OrderSidePanel activeOrderId={orderId} />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
          <h2 className="text-xl font-extrabold text-foreground mb-2">Order Tidak Ditemukan</h2>
          <Link to="/orders" className="text-primary font-bold hover:underline mt-4 text-sm">
            Kembali ke daftar order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Column (Daftar Order Desktop) */}
      <div className="hidden md:block w-[350px] lg:w-[380px] h-full flex-shrink-0 border-r border-border bg-background overflow-hidden">
        <OrderSidePanel activeOrderId={orderId} />
      </div>

      {/* Right Column (Detail Order) */}
      <div className="flex-1 flex flex-col h-full bg-background relative text-foreground min-w-0">
        {/* Header navigasi */}
        <header className="bg-card border-b border-border shrink-0 sticky top-0 z-10">
          <div className="px-3 h-16 flex items-center gap-3">
            <Link to="/orders" className="p-2 -ml-2 rounded-full hover:bg-muted transition md:hidden">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-sm">
                Pesanan #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
          <OrderStatusAlert status={order.status} isBuyer={isBuyer} agreedPrice={order.agreedPrice} />

          {/* Detail Pembayaran & Produk */}
          <OrderDetailCard
            order={order}
            isBuyer={isBuyer}
            getStatusLabel={getStatusLabel}
          />

          {/* Panel Akses Produk Digital */}
          {order.listing?.type === "DIGITAL_PRODUCT" && (
            <div className="bg-card p-5 rounded-sm border border-border shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
              <div className="flex items-center gap-2 mb-3.5">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h4 className="font-extrabold text-foreground text-sm tracking-tight">
                  {isBuyer ? "Akses Produk Digital Anda" : "Pengiriman Otomatis Produk Digital"}
                </h4>
              </div>

              {order.status === "COMPLETED" ? (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isBuyer 
                      ? "Pembayaran Anda telah sukses! Gunakan tombol di bawah ini untuk mengakses atau mengunduh produk digital Anda secara langsung."
                      : "Pembeli telah membayar secara lunas. Pembeli dapat mengunduh produk digital secara langsung melalui panel mereka."}
                  </p>

                  {isBuyer ? (
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      {order.listing.digitalFileObjectKey && (
                        <a
                          href={resolveMediaUrl(order.listing.digitalFileObjectKey)}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-sm bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all text-xs shadow-md shadow-primary/25 cursor-pointer"
                        >
                          <Download className="h-4 w-4 shrink-0" />
                          Unduh File Produk Digital
                        </a>
                      )}

                      {order.listing.digitalLink && (
                        <a
                          href={order.listing.digitalLink.startsWith("http") ? order.listing.digitalLink : `https://${order.listing.digitalLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-sm border border-border bg-background text-foreground font-bold hover:bg-muted transition-all text-xs shadow-sm cursor-pointer"
                        >
                          <ExternalLink className="h-4 w-4 shrink-0" />
                          {order.listing.digitalLink.includes("drive.google.com") || order.listing.digitalLink.includes("docs.google.com") 
                            ? "Buka Tautan Google Drive" 
                            : "Akses Tautan Eksternal"}
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 border border-border bg-muted/30 rounded-sm space-y-2">
                      <h5 className="font-bold text-foreground text-xs">Informasi Pengiriman Produk Anda:</h5>
                      <div className="text-xs text-muted-foreground">
                        {order.listing.digitalFileObjectKey ? (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>Berkas File Aman Terunggah (Privat)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="break-all font-medium text-foreground">Tautan: {order.listing.digitalLink}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : order.status === "CANCELLED" ? (
                <div className="flex items-center gap-3 p-4 border border-red-500/10 bg-red-500/5 rounded-sm text-xs text-red-500 font-medium">
                  <span>✕</span> Transaksi telah dibatalkan. Akses produk digital ditutup.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border border-primary/10 bg-primary/5 rounded-sm text-xs font-semibold text-primary">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>Akses produk digital terkunci. Selesaikan pembayaran terlebih dahulu.</span>
                  </div>
                  {(!isBuyer) && (
                    <div className="text-[11px] text-muted-foreground pt-1 pl-1">
                      <strong>Preview Konfigurasi Anda:</strong>{" "}
                      {order.listing.digitalFileObjectKey ? "Berkas File Aman Terunggah" : `Tautan: ${order.listing.digitalLink}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Ulasan & Komentar Transaksi Selesai */}
          {order.isReviewable && (
            <OrderReviewSection
              status={order.status}
              review={order.review}
              isBuyer={isBuyer}
              onSubmitReview={handleReview}
              reviewLoading={reviewLoading}
            />
          )}
        </div>

        {/* Control Action Panel (Sticky Bottom) */}
        <OrderActionPanel
          status={order.status}
          isBuyer={isBuyer}
          isActionLoading={isActionLoading}
          isPaying={isPaying}
          handleAdvance={handleAdvance}
          handleCancel={async () => {
            const isAccepted = await confirm({
              title: "Batalkan Pesanan",
              message: "Apakah Anda yakin ingin membatalkan pesanan ini?",
              confirmText: "Batalkan Pesanan",
              cancelText: "Batal",
              variant: "destructive",
              maxWidth: "sm",
            });
            if (isAccepted) {
              handleCancel();
            }
          }}
          onPay={handlePay}
          handleFileComplaint={handleFileComplaint}
          handleRefundDisputedOrder={async () => {
            const isAccepted = await confirm({
              title: "Setujui Refund Dana",
              message: "Apakah Anda yakin ingin menyetujui pengembalian dana (refund) penuh ke pembeli?",
              confirmText: "Setujui Refund",
              cancelText: "Batal",
              variant: "success",
              maxWidth: "sm",
            });
            if (isAccepted) {
              handleRefundDisputedOrder();
            }
          }}
          handleRequestCancellationChat={handleRequestCancellationChat}
        />
      </div>
    </div>
  );
}
