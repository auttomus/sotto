import * as React from "react";
import { Loader2, X } from "lucide-react";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { useGetListingsByAccountQuery } from "~/core/apollo/generated";

interface ListingSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (listing: any) => void;
  userAccountId?: string;
  recipientAccountId?: string;
  recipientDisplayName?: string;
}

export function ListingSelectionModal({
  isOpen,
  onClose,
  onSelect,
  userAccountId,
  recipientAccountId,
  recipientDisplayName,
}: ListingSelectionModalProps) {
  const [modalTab, setModalTab] = React.useState<"me" | "them">("me");

  // Fetch current user's listings
  const { data: myListingsData, loading: loadingMyListings } = useGetListingsByAccountQuery({
    variables: { accountId: userAccountId || "" },
    skip: !userAccountId || !isOpen,
  });

  // Fetch recipient's listings
  const { data: recipientListingsData, loading: loadingRecipientListings } = useGetListingsByAccountQuery({
    variables: { accountId: recipientAccountId || "" },
    skip: !recipientAccountId || !isOpen,
  });

  const myListings = myListingsData?.listingsByAccount || [];
  const recipientListings = recipientListingsData?.listingsByAccount || [];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex flex-col justify-end transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-h-[70%] rounded-t-3xl shadow-xl flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base">Sematkan Listing</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-850 transition cursor-pointer"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setModalTab("me")}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition cursor-pointer ${
              modalTab === "me" 
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Listing Anda
          </button>
          <button
            onClick={() => setModalTab("them")}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition cursor-pointer ${
              modalTab === "them" 
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Listing {recipientDisplayName || "Lawan Bicara"}
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {modalTab === "me" ? (
            loadingMyListings ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : myListings.length === 0 ? (
              <div className="text-center text-gray-500 py-10 text-sm font-medium">Anda belum memiliki listing aktif.</div>
            ) : (
              myListings.map((listing: any) => (
                <div 
                  key={listing.id}
                  onClick={() => {
                    onSelect(listing);
                    onClose();
                  }}
                  className="cursor-pointer group animate-fade-in"
                >
                  <ListingCard 
                    listing={listing} 
                    isLink={false} 
                    className="bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 hover:border-indigo-200 dark:hover:border-indigo-900/50" 
                  />
                </div>
              ))
            )
          ) : (
            loadingRecipientListings ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : recipientListings.length === 0 ? (
              <div className="text-center text-gray-500 py-10 text-sm font-medium">Lawan bicara belum memiliki listing aktif.</div>
            ) : (
              recipientListings.map((listing: any) => (
                <div 
                  key={listing.id}
                  onClick={() => {
                    onSelect(listing);
                    onClose();
                  }}
                  className="cursor-pointer group animate-fade-in"
                >
                  <ListingCard 
                    listing={listing} 
                    isLink={false} 
                    className="bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 hover:border-indigo-200 dark:hover:border-indigo-900/50" 
                  />
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
