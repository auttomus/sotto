import * as React from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/Button";

interface ListingActionBarProps {
  isOwnListing: boolean;
  isFullyBooked: boolean;
  isActionLoading: boolean;
  chatLoading: boolean;
  orderLoading: boolean;
  listingType: string;
  handleChat: () => void;
  handleOrder: () => void;
}

export function ListingActionBar({
  isOwnListing,
  isFullyBooked,
  isActionLoading,
  chatLoading,
  orderLoading,
  listingType,
  handleChat,
  handleOrder,
}: ListingActionBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4 pb-safe flex items-center gap-3 shrink-0">
      <button 
        type="button"
        onClick={handleChat}
        disabled={isOwnListing || isActionLoading}
        className="h-12 w-12 flex items-center justify-center rounded-sm border border-border bg-card hover:bg-accent hover:text-accent-foreground transition text-foreground disabled:opacity-50 cursor-pointer"
      >
        {chatLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
      </button>
      {isFullyBooked ? (
        <Button variant="secondary" className="flex-1 h-12 text-base font-bold opacity-70 cursor-not-allowed" disabled>
          Sedang Penuh
        </Button>
      ) : isOwnListing ? (
        <Button variant="secondary" className="flex-1 h-12 text-base font-bold cursor-not-allowed" disabled>
          Listing Milik Anda
        </Button>
      ) : (
        <Button 
          variant="primary" 
          className="flex-1 h-12 text-base font-bold shadow-lg shadow-primary/20 cursor-pointer"
          onClick={handleOrder}
          disabled={isActionLoading}
        >
          {orderLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Memproses...
            </span>
          ) : (
            listingType === 'DIGITAL_PRODUCT' ? 'Beli Sekarang' : 'Pesan Jasa'
          )}
        </Button>
      )}
    </div>
  );
}
