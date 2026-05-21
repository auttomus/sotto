import * as React from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface SearchResultsProps {
  isLoading: boolean;
  accounts: any[];
  listings: any[];
  searchQuery: string;
}

export function SearchResults({ isLoading, accounts, listings, searchQuery }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!accounts.length && !listings.length) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        <p>Tidak ada hasil untuk "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Accounts Results */}
      {accounts.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Talenta</h2>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map((account) => (
              <Link to={`/${account.username}`} key={account.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition cursor-pointer">
                <div className="h-16 w-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                  <img src={resolveMediaUrl(account.avatarObjectKey)} alt={account.displayName} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{account.displayName}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">@{account.username}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Listings Results */}
      {listings.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Penawaran & Pengalaman</h2>
          <div className="space-y-3">
            {listings.map((listing) => (
              <Link to={`/listing/${listing.id}`} key={listing.id} className="flex gap-3 bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition">
                <div className="h-20 w-20 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                  {listing.media?.[0] ? (
                    <img src={resolveMediaUrl(listing.media[0].objectKey || listing.media[0].url)} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">📦</div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">{listing.title}</h4>
                  <span className="text-xs text-gray-500 mb-2 inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md self-start">{listing.type}</span>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-auto">
                    Rp {listing.basePrice?.toLocaleString('id-ID')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
