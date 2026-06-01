import * as React from "react";
import { createPortal } from "react-dom";
import { Coins, X, AlertCircle, Loader2 } from "lucide-react";

interface SplitRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreedPrice: number;
  buyerInputAmount: string;
  onChangeBuyerAmount: (val: string) => void;
  onSubmit: (buyerVal: number) => Promise<boolean>;
  isActionLoading: boolean;
}

export function SplitRefundModal({
  isOpen,
  onClose,
  agreedPrice,
  buyerInputAmount,
  onChangeBuyerAmount,
  onSubmit,
  isActionLoading,
}: SplitRefundModalProps) {
  if (!isOpen || typeof document === "undefined") return null;

  const buyerVal = parseFloat(buyerInputAmount) || 0;
  const computedSellerVal = Math.max(0, agreedPrice - buyerVal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(buyerVal);
  };

  return createPortal(
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
            type="button"
            className="p-1 rounded-full hover:bg-muted text-muted-foreground cursor-pointer transition"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Total Escrow */}
        <div className="bg-muted/40 rounded-xl p-3 border border-border flex justify-between items-center text-xs font-semibold">
          <span className="text-muted-foreground">Total Escrow:</span>
          <span className="text-foreground font-extrabold">Rp {agreedPrice.toLocaleString("id-ID")}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={(e) => onChangeBuyerAmount(e.target.value)}
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
              onClick={onClose}
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
    </div>,
    document.body
  );
}
