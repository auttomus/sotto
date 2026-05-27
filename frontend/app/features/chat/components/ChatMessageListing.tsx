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
      <div className="mt-2 p-3 bg-muted/50 rounded-md border border-border flex items-center justify-center min-h-[80px] w-full">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const listing = data?.listing;
  if (!listing) return null;

  return (
    <ListingCard
      listing={listing as any}
      isLink={true}
      className="mt-2 border border-border shadow-none max-w-sm rounded-md p-2.5"
    />
  );
}
