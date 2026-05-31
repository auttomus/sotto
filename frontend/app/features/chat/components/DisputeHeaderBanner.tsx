import * as React from "react";
import { 
  ShieldAlert, 
  Coins, 
  Check, 
  X, 
  Mail, 
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
import { Button } from "~/components/ui/Button";

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
  complaintReason,
  complaintNotes,
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

  // Auto calculate values for form
  const buyerVal = parseFloat(buyerInputAmount) || 0;
  const computedSellerVal = Math.max(0, agreedPrice - buyerVal);

  const isActionLoading = advanceLoading || refundLoading || proposeLoading || acceptLoading || rejectLoading;

  return (
    <div className="w-full bg-rose-500/5 backdrop-blur-md border border-rose-500/10 border-x-0 p-4 shadow-lg animate-in fade-in duration-300 relative z-20 flex flex-col gap-4">
      {/* Upper Info Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0 mt-0.5">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black tracking-wider uppercase text-rose-500 flex items-center gap-1.5">
              <span>Pesanan Dalam Sengketa</span>
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            </h4>
            <p className="text-xs font-semibold text-foreground">
              Alasan: <span className="text-rose-500 font-bold">{complaintReason || "Lainnya"}</span>
            </p>
            {complaintNotes && (
              <p className="text-[11px] text-muted-foreground bg-muted/30 border border-border px-2.5 py-1.5 rounded-md italic">
                "{complaintNotes}"
              </p>
            )}
            <p className="text-[10px] text-muted-foreground leading-normal max-w-xl">
              Platform membekukan Rp {agreedPrice.toLocaleString("id-ID")} di escrow untuk keamanan. Silakan cari solusi bagi hasil (split) atau persetujuan penyelesaian bersama di bawah ini.
            </p>
          </div>
        </div>

        {/* Mediation Warning Notice */}
        <div className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 max-w-xs space-y-1">
          <div className="flex items-center gap-1 font-bold">
            <Mail className="h-3.5 w-3.5" />
            <span>Deadlock Mediasi Platform</span>
          </div>
          <p className="leading-relaxed">
            Jika pihak lawan tidak merespon dalam waktu <strong>3 hari</strong>, hubungi tim mediasi kami di <a href="mailto:support@sotto.auttomus.xyz" className="underline font-bold text-rose-500 hover:text-rose-600">support@sotto.auttomus.xyz</a> untuk keputusan pencairan sepihak.
          </p>
        </div>
      </div>

      {/* Control Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-rose-500/10">
        
        {/* Split Proposal Status Info */}
        <div className="flex-1">
          {hasProposal ? (
            <div className="bg-muted/40 border border-border rounded-lg px-3 py-2 text-[10px] font-semibold flex items-center gap-2">
              <Coins className="h-4 w-4 text-warning shrink-0 animate-bounce" />
              <div>
                {isProposer ? (
                  <span className="text-muted-foreground">
                    Menunggu keputusan lawan atas proposal bagi hasil Anda:{" "}
                    <strong className="text-foreground">Pembeli Rp {proposedSplitBuyerAmount?.toLocaleString("id-ID")}</strong> |{" "}
                    <strong className="text-foreground">Penjual Rp {proposedSplitSellerAmount?.toLocaleString("id-ID")}</strong>
                  </span>
                ) : (
                  <span className="text-foreground">
                    Lawan mengajukan bagi hasil:{" "}
                    <strong className="text-primary">Pembeli Rp {proposedSplitBuyerAmount?.toLocaleString("id-ID")}</strong> |{" "}
                    <strong className="text-primary">Penjual Rp {proposedSplitSellerAmount?.toLocaleString("id-ID")}</strong>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground italic">
              Belum ada proposal bagi hasil (split refund) yang diajukan.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isActionLoading && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2 select-none">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Memproses...</span>
            </div>
          )}

          {/* ACTIVE INCOMING PROPOSAL ACTIONS */}
          {hasProposal && !isProposer && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                className="bg-success text-success-foreground hover:opacity-90 font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                onClick={handleAcceptProposal}
                disabled={isActionLoading}
              >
                <Check className="h-3.5 w-3.5" />
                <span>Setujui Bagi Hasil</span>
              </Button>
              <Button
                variant="secondary"
                className="border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                onClick={handleRejectProposal}
                disabled={isActionLoading}
              >
                <X className="h-3.5 w-3.5" />
                <span>Tolak</span>
              </Button>
            </div>
          )}

          {/* NO ACTIVE PROPOSAL OR PROPOSED BY ME ACTIONS */}
          {(!hasProposal || isProposer) && (
            <>
              {/* Role specific resolving actions */}
              {isBuyer && (
                <Button
                  variant="primary"
                  className="bg-success text-success-foreground hover:opacity-90 font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  onClick={handleBuyerTarikKomplain}
                  disabled={isActionLoading}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Tarik Komplain & Selesaikan</span>
                </Button>
              )}

              {isSeller && (
                <Button
                  variant="primary"
                  className="bg-destructive text-destructive-foreground hover:opacity-90 font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  onClick={handleSellerRefund100}
                  disabled={isActionLoading}
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Setujui Refund Penuh (100%)</span>
                </Button>
              )}

              {/* Split refund proposal form trigger */}
              <Button
                variant="secondary"
                className="border-border text-foreground hover:bg-muted font-bold text-xs py-2 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                onClick={() => {
                  setBuyerInputAmount(Math.floor(agreedPrice / 2).toString());
                  setIsSplitModalOpen(true);
                }}
                disabled={isActionLoading}
              >
                <Coins className="h-3.5 w-3.5 text-warning" />
                <span>{isProposer ? "Ubah Proposal Split" : "Ajukan Bagi Hasil (Split)"}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* SPLIT PROPOSAL POPUP MODAL */}
      {isSplitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in scale-in duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-black tracking-wide uppercase text-foreground flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-warning" />
                  <span>Proposal Bagi Hasil (Split Refund)</span>
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Tentukan persentase/pembagian dana escrow pesanan ini.
                </p>
              </div>
              <button 
                className="p-1 rounded-md hover:bg-muted text-muted-foreground cursor-pointer"
                onClick={() => setIsSplitModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Total Balance Panel */}
            <div className="bg-muted/40 rounded-lg p-3 border border-border flex justify-between items-center text-xs font-bold">
              <span className="text-muted-foreground">Total Nilai Pesanan:</span>
              <span className="text-foreground text-sm font-extrabold">Rp {agreedPrice.toLocaleString("id-ID")}</span>
            </div>

            {/* Input Form */}
            <form onSubmit={handleProposeSplitSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
                  Refund untuk Pembeli (Rp)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="Masukkan jumlah refund pembeli"
                    value={buyerInputAmount}
                    onChange={(e) => setBuyerInputAmount(e.target.value)}
                    max={agreedPrice}
                    min={0}
                    className="w-full bg-muted/30 border border-border focus:border-rose-500/40 rounded-lg py-2.5 px-3 text-xs font-bold outline-none transition duration-200"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] text-muted-foreground font-black">
                    IDR
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-success/5 border border-success/15 rounded-lg p-2.5 text-center">
                  <div className="text-[9px] font-black uppercase text-success/70 tracking-wider">
                    Porsi Pembeli
                  </div>
                  <div className="text-xs font-extrabold text-success mt-1">
                    Rp {buyerVal.toLocaleString("id-ID")}
                  </div>
                  <div className="text-[9px] text-success/60 font-semibold mt-0.5">
                    ({((buyerVal / agreedPrice) * 100).toFixed(0)}%)
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/15 rounded-lg p-2.5 text-center">
                  <div className="text-[9px] font-black uppercase text-primary/70 tracking-wider">
                    Porsi Penjual
                  </div>
                  <div className="text-xs font-extrabold text-primary mt-1">
                    Rp {computedSellerVal.toLocaleString("id-ID")}
                  </div>
                  <div className="text-[9px] text-primary/60 font-semibold mt-0.5">
                    ({((computedSellerVal / agreedPrice) * 100).toFixed(0)}%)
                  </div>
                </div>
              </div>

              {/* Info Disclaimer */}
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 text-[9px] font-medium text-muted-foreground flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <p className="leading-relaxed">
                  Dengan mengirim proposal ini, Anda mengajukan bagi hasil. Transaksi wallet/escrow hanya akan dieksekusi bila pihak lawan menekan tombol <strong>"Setujui Bagi Hasil"</strong>.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 border-border font-bold text-xs py-2 rounded-lg cursor-pointer"
                  onClick={() => setIsSplitModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-2 bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs py-2 rounded-lg cursor-pointer flex justify-center items-center gap-1.5"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Kirim Proposal</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
