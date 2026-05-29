import * as React from "react";
import { Loader2, X, AlertCircle, Package, ChevronRight } from "lucide-react";
import { useCreateOfferMutation, useGetListingsByAccountQuery } from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { ListingCard } from "~/features/listings/components/ListingCard";

import { useClearableNumberInput } from "~/core/hooks/useClearableNumberInput";

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  buyerAccountId: string;
  sellerAccountId?: string;
  onSuccess?: () => void;
}

export function CreateOfferModal({
  isOpen,
  onClose,
  conversationId,
  buyerAccountId,
  sellerAccountId,
  onSuccess,
}: CreateOfferModalProps) {
  const addToast = useToastStore((s) => s.addToast);
  const [description, setDescription] = React.useState("");
  const [priceStr, setPriceStr] = React.useState("");
  const [deliveryDays, setDeliveryDays] = React.useState(3);
  const [linkedListing, setLinkedListing] = React.useState<any | null>(null);
  const [showListingPicker, setShowListingPicker] = React.useState(false);

  const deliveryDaysInput = useClearableNumberInput({
    value: deliveryDays,
    onChange: setDeliveryDays,
    min: 1,
    defaultValue: 3,
  });

  const { data: myListingsData, loading: loadingListings } = useGetListingsByAccountQuery({
    variables: { accountId: sellerAccountId || "" },
    skip: !sellerAccountId || !isOpen,
  });
  const myListings = myListingsData?.listingsByAccount || [];

  const [createOffer, { loading }] = useCreateOfferMutation({
    onCompleted: () => {
      addToast("success", "Penawaran harga kustom berhasil dikirim!");
      resetForm();
      onSuccess?.();
      onClose();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const resetForm = () => {
    setDescription("");
    setPriceStr("");
    deliveryDaysInput.setValue(3);
    setLinkedListing(null);
    setShowListingPicker(false);
  };

  // Reset form saat modal dibuka
  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Pre-populate saat listing dipilih dari picker
  const handleSelectListing = (listing: any) => {
    setLinkedListing(listing);
    setShowListingPicker(false);
    setDescription(`Penawaran khusus untuk listing: ${listing.title}\n\n`);
    setPriceStr(Number(listing.price).toLocaleString("id-ID"));
  };

  const handleRemoveListing = () => {
    setLinkedListing(null);
    setDescription("");
    setPriceStr("");
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = priceStr ? parseFloat(priceStr.replace(/[^0-9]/g, "")) : 0;
    if (!description.trim()) {
      addToast("error", "Deskripsi penawaran tidak boleh kosong");
      return;
    }
    if (isNaN(price) || price < 0) {
      addToast("error", "Harga penawaran harus valid dan minimal Rp 0");
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
          listingId: linkedListing?.id || undefined,
        },
      },
    });
  };

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex flex-col justify-end transition-all duration-300">
      <div className="bg-card w-full max-h-[85%] rounded-t-3xl border-t border-x border-border shadow-xl flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm md:text-base">
            {showListingPicker ? "Pilih Listing" : "Buat Penawaran Kustom"}
          </h3>
          <button 
            type="button"
            onClick={showListingPicker ? () => setShowListingPicker(false) : onClose}
            className="p-1.5 rounded-full hover:bg-muted transition cursor-pointer"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* ── Listing Picker View ──────────────────────────── */}
        {showListingPicker ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingListings ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : myListings.length === 0 ? (
              <div className="text-center text-muted-foreground py-10 text-sm font-medium">
                Anda belum memiliki listing aktif.
              </div>
            ) : (
              myListings.map((listing: any) => (
                <div 
                  key={listing.id}
                  onClick={() => handleSelectListing(listing)}
                  className="cursor-pointer group animate-fade-in"
                >
                  <ListingCard 
                    listing={listing} 
                    isLink={false} 
                    className="hover:bg-primary/5 hover:border-primary/50" 
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          /* ── Offer Form View ──────────────────────────── */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Listing Link Section */}
            {linkedListing ? (
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 animate-fade-in">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                    <div className="h-10 w-10 rounded-sm bg-muted overflow-hidden shrink-0 border border-border">
                      {linkedListing.media?.[0] ? (
                        <img 
                          src={resolveMediaUrl(linkedListing.media[0].objectKey || linkedListing.media[0].url)} 
                          alt={linkedListing.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary text-base font-semibold bg-primary/10">📦</div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[9px] text-primary font-bold uppercase tracking-wider leading-none mb-0.5">Penawaran Diskon Listing</span>
                      <h4 className="text-xs font-bold text-foreground truncate leading-tight mb-0.5">{linkedListing.title}</h4>
                      <span className="text-[10px] text-muted-foreground font-semibold leading-tight">
                        Harga Asli: Rp {Number(linkedListing.price).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveListing}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition cursor-pointer shrink-0"
                    title="Lepas listing"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowListingPicker(true)}
                className="w-full p-3 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition flex items-center gap-3 group cursor-pointer"
              >
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition shrink-0">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left flex-1 min-w-0">
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition">Hubungkan dengan Listing</span>
                  <span className="text-[10px] text-muted-foreground font-medium">Opsional — tawarkan diskon untuk listing Anda</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition shrink-0" />
              </button>
            )}

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
                <div className="flex items-center bg-muted border border-border rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => deliveryDaysInput.setValue(Math.max(1, deliveryDays - 1))}
                    className="px-3.5 py-2.5 hover:bg-muted-foreground/10 text-muted-foreground font-bold transition cursor-pointer"
                    disabled={loading}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={deliveryDaysInput.value}
                    onChange={deliveryDaysInput.onChange}
                    onBlur={deliveryDaysInput.onBlur}
                    className="w-full text-center text-sm font-semibold border-none bg-transparent focus:ring-0 outline-none text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => deliveryDaysInput.setValue(deliveryDays + 1)}
                    className="px-3.5 py-2.5 hover:bg-muted-foreground/10 text-muted-foreground font-bold transition cursor-pointer"
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-sm p-3 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                Penawaran khusus ini akan dikirim langsung ke obrolan sebagai kartu interaktif. Pembeli dapat memilih untuk menyetujuinya, yang secara otomatis akan memulai transaksi order.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-sm bg-primary hover:opacity-90 text-primary-foreground font-semibold text-sm transition shadow-lg shadow-primary/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        )}
      </div>
    </div>
  );
}
