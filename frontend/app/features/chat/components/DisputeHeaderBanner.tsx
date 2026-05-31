import * as React from "react";
import { 
  ShieldAlert, 
  Coins, 
  X, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { 
  useAdvanceOrderStatusMutation, 
  useRefundDisputedOrderMutation, 
  useProposeSplitRefundMutation, 
  useAcceptSplitRefundMutation, 
  useRejectSplitRefundMutation 
} from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";

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
  const addToast = useToastStore((s) => s.addToast);
  const [isSplitModalOpen, setIsSplitModalOpen] = React.useState(false);
  const [buyerInputAmount, setBuyerInputAmount] = React.useState<string>("");

  // Mutations
  const [advanceOrder, { loading: advanceLoading }] = useAdvanceOrderStatusMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [refundOrder, { loading: refundLoading }] = useRefundDisputedOrderMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [proposeSplit, { loading: proposeLoading }] = useProposeSplitRefundMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [acceptSplit, { loading: acceptLoading }] = useAcceptSplitRefundMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });
  const [rejectSplit, { loading: rejectLoading }] = useRejectSplitRefundMutation({
    refetchQueries: ["GetConversations", "GetMessages"]
  });

  const isBuyer = currentUserId === buyerAccountId;
  const isSeller = currentUserId === sellerAccountId;

  const hasProposal = !!proposedSplitById;
  const isProposer = proposedSplitById === currentUserId;

  if (status !== "DISPUTED") return null;

  // Handlers
  const handleBuyerTarikKomplain = async () => {
    try {
      await advanceOrder({ variables: { orderId } });
      addToast("success", "Komplain berhasil ditarik. Pesanan selesai!");
    } catch (err: any) {
      addToast("error", err.message || "Gagal memproses penarikan komplain.");
    }
  };

  const handleSellerRefund100 = async () => {
    try {
      await refundOrder({ variables: { orderId } });
      addToast("success", "Refund penuh disetujui. Dana dikembalikan ke pembeli!");
    } catch (err: any) {
      addToast("error", err.message || "Gagal memproses refund penuh.");
    }
  };

  const handleProposeSplitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const buyerVal = parseFloat(buyerInputAmount);
    if (isNaN(buyerVal) || buyerVal < 0 || buyerVal > agreedPrice) {
      addToast("error", `Jumlah refund pembeli harus antara Rp 0 - Rp ${agreedPrice.toLocaleString()}`);
      return;
    }

    const sellerVal = agreedPrice - buyerVal;

    try {
      await proposeSplit({
        variables: {
          orderId,
          buyerAmount: buyerVal,
          sellerAmount: sellerVal,
        }
      });
      addToast("success", "Proposal bagi hasil berhasil diajukan!");
      setIsSplitModalOpen(false);
    } catch (err: any) {
      addToast("error", err.message || "Gagal mengajukan proposal bagi hasil.");
    }
  };

  const handleAcceptProposal = async () => {
    try {
      await acceptSplit({ variables: { orderId } });
      addToast("success", "Bagi hasil disetujui. Sengketa selesai!");
    } catch (err: any) {
      addToast("error", err.message || "Gagal menyetujui bagi hasil.");
    }
  };

  const handleRejectProposal = async () => {
    try {
      await rejectSplit({ variables: { orderId } });
      addToast("success", "Proposal bagi hasil ditolak.");
    } catch (err: any) {
      addToast("error", err.message || "Gagal menolak proposal.");
    }
  };

  const buyerVal = parseFloat(buyerInputAmount) || 0;
  const computedSellerVal = Math.max(0, agreedPrice - buyerVal);

  const isActionLoading = advanceLoading || refundLoading || proposeLoading || acceptLoading || rejectLoading;

  return (
    <div className="w-full bg-rose-500/5 dark:bg-rose-950/10 border-b border-rose-500/10 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none relative z-20 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Left: Info Indicator */}
      <div className="flex items-center gap-2.5 min-w-0">
        <ShieldAlert className="h-4.5 w-4.5 text-rose-500 shrink-0 animate-pulse" />
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold px-2.5 py-0.5 rounded-full text-[9px] tracking-wide uppercase shrink-0">
            Sengketa
          </span>
          {hasProposal ? (
            <span className="text-muted-foreground truncate font-semibold text-[11px]">
              {isProposer ? (
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
              )}
            </span>
          ) : (
            <span className="text-muted-foreground truncate font-semibold text-[11px]">
              Diskusikan solusi bagi hasil (split refund) atau penyelesaian bersama di sini.
            </span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
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
          <div className="flex gap-2">
            {isBuyer && (
              <button
                onClick={handleBuyerTarikKomplain}
                disabled={isActionLoading}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold px-3.5 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 text-[10px] active:scale-[0.98]"
              >
                Tarik Komplain
              </button>
            )}

            {isSeller && (
              <button
                onClick={handleSellerRefund100}
                disabled={isActionLoading}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold px-3.5 py-1.5 rounded-full transition cursor-pointer disabled:opacity-50 text-[10px] active:scale-[0.98]"
              >
                Refund 100%
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

      {/* SPLIT PROPOSAL POPUP MODAL (Clean, Modern Modal) */}
      {isSplitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-5 space-y-4 animate-in scale-in duration-300">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                  <Coins className="h-4.5 w-4.5 text-warning" />
                  <span>Proposal Bagi Hasil</span>
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Tentukan pembagian porsi dana escrow.
                </p>
              </div>
              <button 
                className="p-1 rounded-full hover:bg-muted text-muted-foreground cursor-pointer transition"
                onClick={() => setIsSplitModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Total Balance */}
            <div className="bg-muted/40 rounded-xl p-3 border border-border flex justify-between items-center text-xs font-semibold">
              <span className="text-muted-foreground">Total Escrow:</span>
              <span className="text-foreground font-extrabold">Rp {agreedPrice.toLocaleString("id-ID")}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleProposeSplitSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                  Porsi Pembeli (Rp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 50000"
                    value={buyerInputAmount}
                    onChange={(e) => setBuyerInputAmount(e.target.value)}
                    max={agreedPrice}
                    min={0}
                    className="w-full bg-muted/30 border border-border focus:border-primary/40 rounded-xl py-2.5 px-3 text-xs font-bold outline-none transition duration-200"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] text-muted-foreground font-black">
                    IDR
                  </div>
                </div>
              </div>

              {/* Grid Output */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-2.5 text-center">
                  <div className="text-[9px] font-black uppercase text-emerald-600/80 tracking-wider">
                    Porsi Pembeli
                  </div>
                  <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Rp {buyerVal.toLocaleString("id-ID")}
                  </div>
                  <div className="text-[9px] text-emerald-600/60 font-semibold mt-0.5">
                    ({((buyerVal / agreedPrice) * 100).toFixed(0)}%)
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-2.5 text-center">
                  <div className="text-[9px] font-black uppercase text-primary/80 tracking-wider">
                    Porsi Penjual
                  </div>
                  <div className="text-xs font-extrabold text-primary mt-0.5">
                    Rp {computedSellerVal.toLocaleString("id-ID")}
                  </div>
                  <div className="text-[9px] text-primary/60 font-semibold mt-0.5">
                    ({((computedSellerVal / agreedPrice) * 100).toFixed(0)}%)
                  </div>
                </div>
              </div>

              {/* Info Alert */}
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-[9px] leading-relaxed text-muted-foreground flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <p>
                  Negosiasi ini didasarkan pada kesepakatan bersama. Wallet akan dicairkan secara aman ketika pihak lawan menekan tombol <strong>"Setujui"</strong>.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsSplitModalOpen(false)}
                  className="flex-1 border border-border hover:bg-muted font-bold text-xs py-2 rounded-xl transition cursor-pointer text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs py-2 rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5 disabled:opacity-50"
                >
                  {isActionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                  ) : (
                    <span>Kirim Proposal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
