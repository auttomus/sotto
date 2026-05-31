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
  handleRequestCancellationChat?: (withMessage?: boolean) => void;
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
  handleRequestCancellationChat,
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
          {isBuyer && onPay ? (
            <Button
              variant="primary"
              className="flex-1 font-bold text-xs py-2.5 rounded-sm bg-primary hover:opacity-90 text-primary-foreground border-0 shadow-md shadow-primary/25 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
              onClick={onPay}
              disabled={isPaying || isActionLoading}
            >
              {isPaying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Bayar Sekarang</span>
              )}
            </Button>
          ) : (
            <div className="w-full bg-muted/40 text-muted-foreground text-center py-2.5 rounded-sm text-xs font-semibold select-none italic">
              Menunggu pembayaran dari pembeli
            </div>
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
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg space-y-3">
          <div className="flex items-start gap-2 px-1 text-[10px] text-muted-foreground font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
            <p className="leading-normal">
              Pesanan sedang diproses aktif oleh penjual. Anda tidak dapat membatalkan pesanan secara sepihak. Hubungi penjual via chat jika membutuhkan bantuan.
            </p>
          </div>
          <Button
            variant="secondary"
            className="w-full font-bold text-xs py-2.5 rounded-lg border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 transition duration-200"
            onClick={() => handleRequestCancellationChat?.(true)}
            disabled={isActionLoading}
          >
            {isActionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Ajukan Pembatalan (Chat Penjual)</span>
            )}
          </Button>
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
              Batal
            </Button>
            <Button
              variant="primary"
              className="flex-1 font-bold text-xs py-2.5 rounded-sm bg-success hover:opacity-90 text-success-foreground border-0 shadow-md shadow-success/25 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex justify-center items-center gap-1.5"
              onClick={handleAdvance}
              disabled={isActionLoading}
            >
              <span>Kirim Pekerjaan</span>
            </Button>
          </div>
        </div>
      );
    }
  }

  // 3. DELIVERED
  if (status === OrderStatus.Delivered) {
    if (isBuyer) {
      // Pembeli menyetujui (selesai) atau mengajukan komplain sengketa
      return (
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg space-y-3">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 font-bold text-xs py-2.5 rounded-lg border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 cursor-pointer disabled:opacity-50"
              onClick={() => setIsModalOpen(true)}
              disabled={isActionLoading}
            >
              Ajukan Komplain (Sengketa)
            </Button>
            <Button
              variant="primary"
              className="flex-1 font-bold text-xs py-2.5 rounded-lg bg-success hover:opacity-90 text-success-foreground border-0 shadow-md shadow-success/25 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
              onClick={handleAdvance}
              disabled={isActionLoading}
            >
              Setujui & Selesaikan
            </Button>
          </div>

          {isModalOpen && (
            <ComplaintModal
              onSubmit={(reason, notes) => {
                setIsModalOpen(false);
                if (handleFileComplaint) {
                  handleFileComplaint(reason, notes);
                }
              }}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      );
    } else {
      // Penjual menunggu persetujuan pembeli
      return (
        <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg flex justify-center items-center">
          <div className="w-full bg-muted/40 text-muted-foreground text-center py-2.5 rounded-sm text-xs font-semibold select-none italic">
            Menunggu persetujuan penyelesaian dari pembeli
          </div>
        </div>
      );
    }
  }

  // 4. DISPUTED
  if (status === OrderStatus.Disputed) {
    return (
      <div className="bg-card border-t border-border p-4 pb-safe shrink-0 shadow-lg space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-start gap-2 px-1 text-[10px] text-muted-foreground font-medium">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500 mt-0.5" />
          <p className="leading-normal">
            Sengketa pesanan aktif. Semua opsi mediasi (penarikan komplain, refund penuh, bagi hasil split, dan negosiasi) dipindahkan langsung ke dalam ruang chat untuk mendorong diskusi interaktif.
          </p>
        </div>
        <Button
          variant="primary"
          className="w-full font-bold text-xs py-2.5 rounded-lg bg-primary hover:opacity-90 text-primary-foreground border-0 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition duration-200"
          onClick={() => handleRequestCancellationChat?.(false)}
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>Bahas Solusi di Chat Sengketa</span>
          )}
        </Button>
      </div>
    );
  }

  return null;
}
