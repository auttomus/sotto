import * as React from "react";
import { Loader2, X, AlertCircle } from "lucide-react";
import { useCreateOfferMutation } from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  buyerAccountId: string;
  listingId?: string | null;
  onSuccess?: () => void;
}

export function CreateOfferModal({
  isOpen,
  onClose,
  conversationId,
  buyerAccountId,
  listingId,
  onSuccess,
}: CreateOfferModalProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [description, setDescription] = React.useState("");
  const [priceStr, setPriceStr] = React.useState("");
  const [deliveryDays, setDeliveryDays] = React.useState(3);

  const [createOffer, { loading }] = useCreateOfferMutation({
    onCompleted: () => {
      addToast("success", "Penawaran harga kustom berhasil dikirim!");
      setDescription("");
      setPriceStr("");
      setDeliveryDays(3);
      onSuccess?.();
      onClose();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(priceStr.replace(/[^0-9]/g, ""));
    if (!description.trim()) {
      addToast("error", "Deskripsi penawaran tidak boleh kosong");
      return;
    }
    if (isNaN(price) || price <= 0) {
      addToast("error", "Harga penawaran harus valid dan lebih dari 0");
      return;
    }

    createOffer({
      variables: {
        input: {
          conversationId,
          buyerAccountId,
          description,
          proposedPrice: price,
          deliveryTimeDays: deliveryDays,
          listingId: listingId || undefined,
        },
      },
    });
  };

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex flex-col justify-end transition-all duration-300">
      <div className="bg-card w-full max-h-[85%] rounded-t-3xl border-t border-x border-border shadow-xl flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm md:text-base">Buat Penawaran Kustom</h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition cursor-pointer"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="form-label mb-1.5 block">
              Deskripsi Penawaran Jasa
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan secara mendetail jasa, revisi, atau deliverables khusus yang Anda tawarkan..."
              className="form-input w-full p-3 text-sm"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label mb-1.5 block">
                Harga Penawaran (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</span>
                <input
                  type="text"
                  value={priceStr}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9]/g, "");
                    setPriceStr(cleaned ? Number(cleaned).toLocaleString("id-ID") : "");
                  }}
                  placeholder="150.000"
                  className="form-input w-full py-2.5 pl-10 pr-3 text-sm font-semibold"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="form-label mb-1.5 block">
                Waktu Pengerjaan (Hari)
              </label>
              <div className="flex items-center bg-muted border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setDeliveryDays((d) => Math.max(1, d - 1))}
                  className="px-3.5 py-2.5 hover:bg-muted-foreground/10 text-muted-foreground font-bold transition cursor-pointer"
                  disabled={loading}
                >
                  -
                </button>
                <input
                  type="number"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center text-sm font-semibold border-none bg-transparent focus:ring-0 outline-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setDeliveryDays((d) => d + 1)}
                  className="px-3.5 py-2.5 hover:bg-muted-foreground/10 text-muted-foreground font-bold transition cursor-pointer"
                  disabled={loading}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-md p-3 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
              Penawaran khusus ini akan dikirim langsung ke obrolan sebagai kartu interaktif. Pembeli dapat memilih untuk menyetujuinya, yang secara otomatis akan memulai transaksi order.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-md bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm transition shadow-lg shadow-primary/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <span>Kirim Penawaran</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
