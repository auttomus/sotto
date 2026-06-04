import * as React from "react";
import { Loader2 } from "lucide-react";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { useGetListingDetailQuery } from "~/core/apollo/generated";

interface ChatMessageListingProps {
  listingId: string;
}

export function ChatMessageListing({ listingId }: ChatMessageListingProps) {
  const { data, loading } = useGetListingDetailQuery({
    variables: { id: listingId },
    skip: !listingId,
  });

  if (loading) {
    return (
      <div className="mt-2 p-3 bg-muted/50 rounded-sm border border-border flex items-center justify-center min-h-[80px] w-full">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const listing = data?.listing;
  if (!listing) return null;

  if (listing.status === "ARCHIVED") {
    return (
      <div className="relative mt-2 max-w-sm opacity-75 select-none group">
        <ListingCard
          listing={listing as any}
          isLink={false}
          className="border border-border/80 shadow-none rounded-sm p-2.5 bg-muted/65 grayscale pointer-events-none"
        />
        <div className="absolute top-2.5 left-2.5 bg-destructive/10 text-destructive border border-destructive/25 rounded px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wide shadow-sm">
          Diarsipkan
        </div>
      </div>
    );
  }

  return (
    <ListingCard
      listing={listing as any}
      isLink={true}
      className="mt-2 border border-border shadow-none max-w-sm rounded-sm p-2.5"
    />
  );
}
