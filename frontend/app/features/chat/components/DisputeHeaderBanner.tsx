import * as React from "react";
import { ShieldAlert, Coins, Loader2 } from "lucide-react";
import { useDisputeMediation } from "../hooks/useDisputeMediation";
import { SplitRefundModal } from "./SplitRefundModal";

interface DisputeHeaderBannerProps {
  orderId: string;
  status: string;
  agreedPrice: number;
  buyerAccountId: string;
  sellerAccountId: string;
  complaintReason?: string | null;
  complaintNotes?: string | null;
  proposedSplitBuyerAmount?: number | null;
  proposedSplitSellerAmount?: number | null;
  proposedSplitById?: string | null;
  currentUserId: string;
}

export function DisputeHeaderBanner({
  orderId,
  status,
  agreedPrice,
  buyerAccountId,
  sellerAccountId,
  proposedSplitBuyerAmount,
  proposedSplitSellerAmount,
  proposedSplitById,
  currentUserId,
}: DisputeHeaderBannerProps) {
  const {
    isSplitModalOpen,
    setIsSplitModalOpen,
    buyerInputAmount,
    setBuyerInputAmount,
    handleBuyerTarikKomplain,
    handleSellerRefund100,
    handleProposeSplitSubmit,
    handleAcceptProposal,
    handleRejectProposal,
    isActionLoading,
  } = useDisputeMediation({ orderId, agreedPrice });

  const isBuyer = currentUserId === buyerAccountId;
  const isSeller = currentUserId === sellerAccountId;

  const hasProposal = !!proposedSplitById;
  const isProposer = proposedSplitById === currentUserId;

  if (status !== "DISPUTED") return null;

  return (
    <div className="w-full bg-white dark:bg-card border-b border-border px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs select-none relative z-20 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {hasProposal && (
              <span className="bg-warning/10 text-warning dark:text-warning/80 font-extrabold px-2 py-0.5 rounded-full text-[9px] tracking-wide uppercase shrink-0">
                Proposal Bagi Hasil
              </span>
            )}
          </div>
          <p className="text-muted-foreground font-semibold text-[11px] leading-relaxed break-words">
            {hasProposal ? (
              isProposer ? (
                <>
                  Menunggu respon lawan atas proposal Anda:{" "}
                  <strong className="text-foreground">Pembeli Rp {proposedSplitBuyerAmount?.toLocaleString("id-ID")}</strong> |{" "}
                  <strong className="text-foreground">Penjual Rp {proposedSplitSellerAmount?.toLocaleString("id-ID")}</strong>
                </>
              ) : (
                <>
                  Lawan mengajukan porsi:{" "}
                  <strong className="text-primary">Pembeli Rp {proposedSplitBuyerAmount?.toLocaleString("id-ID")}</strong> |{" "}
                  <strong className="text-primary">Penjual Rp {proposedSplitSellerAmount?.toLocaleString("id-ID")}</strong>
                </>
              )
            ) : (
              "Diskusikan solusi bagi hasil (split refund) atau penyelesaian bersama di sini."
            )}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-wrap justify-start md:justify-end w-full md:w-auto shrink-0 pt-2 md:pt-0">
        {isActionLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-1" />
        )}

        {hasProposal && !isProposer ? (
          <div className="flex gap-2">
            <button
              onClick={handleAcceptProposal}
              disabled={isActionLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-3.5 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 text-[10px] active:scale-[0.98]"
            >
              Setujui
            </button>
            <button
              onClick={handleRejectProposal}
              disabled={isActionLoading}
              className="border border-rose-500/25 text-rose-600 hover:bg-rose-500/5 font-extrabold px-3.5 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 text-[10px] active:scale-[0.98]"
            >
              Tolak
            </button>
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {isBuyer && (
              <button
                onClick={handleBuyerTarikKomplain}
                disabled={isActionLoading}
                className="bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-foreground/90 font-extrabold px-3.5 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 text-[10px] active:scale-[0.98]"
              >
                Tarik Komplain (Bayar Penuh)
              </button>
            )}

            {isSeller && (
              <button
                onClick={handleSellerRefund100}
                disabled={isActionLoading}
                className="bg-primary/10 hover:bg-primary/20 text-primary dark:text-primary-foreground/90 font-extrabold px-3.5 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 text-[10px] active:scale-[0.98]"
              >
                 Kembalikan Dana (Refund Penuh)
              </button>
            )}

            <button
              onClick={() => {
                setBuyerInputAmount(Math.floor(agreedPrice / 2).toString());
                setIsSplitModalOpen(true);
              }}
              disabled={isActionLoading}
              className="border border-border bg-card hover:bg-muted font-extrabold px-3.5 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 text-[10px] flex items-center gap-1 active:scale-[0.98]"
            >
              <Coins className="h-3.5 w-3.5 text-warning shrink-0" />
              <span>{isProposer ? "Ubah Split" : "Bagi Hasil (Split)"}</span>
            </button>
          </div>
        )}
      </div>

      <SplitRefundModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        agreedPrice={agreedPrice}
        buyerInputAmount={buyerInputAmount}
        onChangeBuyerAmount={setBuyerInputAmount}
        onSubmit={handleProposeSplitSubmit}
        isActionLoading={isActionLoading}
      />
    </div>
  );
}
