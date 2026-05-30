import * as React from "react";
import { X, Loader2 } from "lucide-react";
import { ListingCard } from "~/features/listings/components/ListingCard";

interface ListingSelectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  listingsLoading: boolean;
  activeListings: any[];
  replyListingId: string | null;
  setReplyListingId: (id: string | null) => void;
}

export function ListingSelectorDrawer({
  isOpen,
  onClose,
  listingsLoading,
  activeListings,
  replyListingId,
  setReplyListingId,
}: ListingSelectorDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border-t border-border rounded-t-3xl shadow-2xl w-full max-w-lg max-h-[60vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-12 bg-border rounded-full mx-auto my-3 shrink-0" />
        <header className="px-4 pb-3 border-b border-border flex justify-between items-center shrink-0">
          <h3 className="text-sm font-bold text-foreground">Sematkan Penawaran / Jasa</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted cursor-pointer"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </header>

        <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-0">
          {listingsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : activeListings.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              Belum ada penawaran aktif.
            </div>
          ) : (
            <div className="space-y-2">
              {activeListings.map((listing: any) => (
                <button
                  type="button"
                  key={listing.id}
                  onClick={() => {
                    setReplyListingId(listing.id);
                    onClose();
                  }}
                  className="w-full text-left focus:outline-none cursor-pointer"
                >
                  <ListingCard
                    listing={listing as any}
                    isLink={false}
                    className={
                      replyListingId === listing.id
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : ""
                    }
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
