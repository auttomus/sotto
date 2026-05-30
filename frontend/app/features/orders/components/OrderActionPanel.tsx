import * as React from "react";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { OrderStatus } from "~/core/apollo/base-types";
import { Button } from "~/components/ui/Button";
import { ComplaintModal } from "./ComplaintModal";

interface OrderActionPanelProps {
  status: OrderStatus;
  isBuyer: boolean;
  isActionLoading: boolean;
  isPaying?: boolean;
  handleAdvance: () => void;
  handleCancel: () => void;
  onPay?: () => void;
  handleFileComplaint?: (reason: string, notes?: string) => void;
  handleRefundDisputedOrder?: () => void;
}

export function OrderActionPanel({
  status,
  isBuyer,
  isActionLoading,
  isPaying = false,
  handleAdvance,
  handleCancel,
  onPay,
  handleFileComplaint,
  handleRefundDisputedOrder,
}: OrderActionPanelProps) {
  // State untuk form komplain modal premium
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // 1. PENDING_PAYMENT
  if (status === OrderStatus.PendingPayment) {
    return (
      <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg space-y-3">
        {isBuyer && onPay && (
          <div className="flex items-center gap-2 px-1 text-[9px] text-primary font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Pembayaran Escrow Terjamin & Aman</span>
          </div>
        )}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 font-bold text-xs py-2.5 rounded-sm border border-border text-foreground hover:bg-muted cursor-pointer disabled:opacity-50"
            onClick={handleCancel}
            disabled={isActionLoading || isPaying}
          >
            Batalkan Order
          </Button>

          {isBuyer && onPay && (
            <Button
              variant="primary"
              className="flex-[2] font-extrabold text-xs py-2.5 rounded-sm bg-primary hover:opacity-90 text-primary-foreground border-0 shadow-lg shadow-primary/10 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              onClick={onPay}
              disabled={isActionLoading || isPaying}
            >
              {isPaying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyiapkan...</span>
                </>
              ) : (
                <span>Bayar Sekarang (Midtrans)</span>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 2. IN_PROGRESS
  if (status === OrderStatus.InProgress) {
    if (isBuyer) {
      // Pembeli tidak boleh membatalkan secara sepihak (Lapis 1)
      return (
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg">
          <div className="flex items-start gap-2 px-1 text-[10px] text-muted-foreground font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
            <p className="leading-normal">
              Pesanan sedang diproses aktif oleh penjual. Anda tidak dapat membatalkan pesanan secara sepihak. Hubungi penjual via chat jika membutuhkan bantuan.
            </p>
          </div>
        </div>
      );
    } else {
      // Penjual dapat mengirim pekerjaan (Kirim Pekerjaan) atau membatalkan sukarela
      return (
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 font-bold text-xs py-2.5 rounded-sm border border-border text-foreground hover:bg-muted cursor-pointer disabled:opacity-50"
              onClick={handleCancel}
              disabled={isActionLoading}
            >
              Batalkan & Refund
            </Button>
            <Button
              variant="primary"
              className="flex-2 font-bold text-xs py-2.5 rounded-sm bg-primary hover:opacity-90 text-primary-foreground border-0 shadow-lg active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              onClick={handleAdvance}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Kirim Pekerjaan Selesai</span>
              )}
            </Button>
          </div>
        </div>
      );
    }
  }

  // 3. DELIVERED
  if (status === OrderStatus.Delivered) {
    if (isBuyer) {
      // Pembeli dapat menyelesaikan pesanan atau mengajukan komplain
      return (
        <>
          <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-2 mb-3 px-1 text-[10px] text-muted-foreground font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <p className="leading-normal">
                Silakan periksa hasil pekerjaan. Klik 'Selesaikan Pesanan' untuk mencairkan escrow, atau 'Ajukan Komplain' jika ada kendala sebelum batas 24 jam.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 font-bold text-xs py-2.5 rounded-sm border border-destructive/30 text-destructive bg-destructive/5 hover:bg-destructive/10 cursor-pointer disabled:opacity-50"
                onClick={() => setIsModalOpen(true)}
                disabled={isActionLoading}
              >
                Ajukan Komplain
              </Button>
              <Button
                variant="primary"
                className="flex-1 font-bold text-xs py-2.5 rounded-sm bg-success hover:opacity-90 text-success-foreground border-0 shadow-lg active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                onClick={handleAdvance}
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Selesaikan Pesanan</span>
                )}
              </Button>
            </div>
          </div>

          {/* Dialog Modal Komplain Sengketa Premium Terpisah */}
          {isModalOpen && (
            <ComplaintModal
              onSubmit={(reason, notes) => {
                if (handleFileComplaint) {
                  handleFileComplaint(reason, notes);
                }
              }}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      );
    } else {
      // Penjual menunggu persetujuan pembeli
      return (
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg">
          <div className="flex items-start gap-2 px-1 text-[10px] text-muted-foreground font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <p className="leading-normal">
              Pekerjaan telah terkirim. Menunggu tanggapan dari pembeli. Dana escrow akan otomatis dicairkan dalam waktu 24 jam jika pembeli tidak melakukan tindakan.
            </p>
          </div>
        </div>
      );
    }
  }

  // 4. DISPUTED
  if (status === OrderStatus.Disputed) {
    if (isBuyer) {
      // Pembeli dapat membatalkan komplain dan menyelesaikan
      return (
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg">
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1 font-bold text-xs py-2.5 rounded-sm bg-success hover:opacity-90 text-success-foreground border-0 shadow-lg active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              onClick={handleAdvance}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Tarik Komplain & Selesaikan</span>
              )}
            </Button>
          </div>
        </div>
      );
    } else {
      // Penjual dapat setuju refund secara sukarela untuk menyelesaikan sengketa
      return (
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg">
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1 font-bold text-xs py-2.5 rounded-sm bg-destructive hover:opacity-90 text-destructive-foreground border-0 shadow-lg active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              onClick={handleRefundDisputedOrder}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Setujui Refund & Kembalikan Dana</span>
              )}
            </Button>
          </div>
        </div>
      );
    }
  }

  return null;
}
