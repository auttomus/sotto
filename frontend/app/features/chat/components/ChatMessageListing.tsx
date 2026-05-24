import * as React from "react";
import { Loader2 } from "lucide-react";
import { ListingCard } from "~/components/ui/ListingCard";
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
      <div className="mt-2 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-150 dark:border-gray-700/50 flex items-center justify-center min-h-[80px] w-full">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
      </div>
    );
  }

  const listing = data?.listing;
  if (!listing) return null;

  return (
    <ListingCard
      listing={listing as any}
      isLink={true}
      className="mt-2 bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800 shadow-sm max-w-sm rounded-2xl p-2.5"
    />
  );
}
