import * as React from "react";
import { Link } from "react-router";
import { Loader2, Hash, Briefcase, User, Sparkles } from "lucide-react";
import { PostCard } from "~/features/feed/components/PostCard";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface SearchResultsProps {
  isLoading: boolean;
  accounts: any[];
  listings: any[];
  posts: any[];
  tags: any[];
  searchQuery: string;
  onTagClick?: (tag: string) => void;
}

export function SearchResults({ 
  isLoading, 
  accounts, 
  listings, 
  posts, 
  tags, 
  searchQuery,
  onTagClick 
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const hasResults = accounts.length > 0 || listings.length > 0 || posts.length > 0 || tags.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-900 dark:text-gray-100 font-medium">Tidak ada hasil ditemukan</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Coba gunakan kata kunci lain untuk "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Tag Results */}
      {tags.length > 0 && (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-indigo-500" /> Topik & Tag
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagClick?.(tag.name)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700/80 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                <Hash className="h-3.5 w-3.5 opacity-60" />
                <span>{tag.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Accounts Results */}
      {accounts.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5 px-1">
            <User className="h-3.5 w-3.5 text-indigo-500" /> Talenta & Kreator
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map((account) => (
              <Link 
                to={`/profile/${account.username}`} 
                key={account.id} 
                className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="h-16 w-16 rounded-full bg-gray-200 mb-3 overflow-hidden border-2 border-indigo-50 dark:border-indigo-950/50 shadow-inner shrink-0 group-hover:scale-105 transition duration-200">
                  {account.avatarObjectKey ? (
                    <img 
                      src={resolveMediaUrl(account.avatarObjectKey)} 
                      alt={account.displayName} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 font-bold text-lg">
                      {account.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {account.displayName}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@{account.username}</p>
                {account.schoolName && (
                  <span className="text-[10px] mt-2 px-2 py-0.5 bg-gray-50 dark:bg-gray-800/80 rounded-md border border-gray-100/50 dark:border-gray-700/50 text-gray-500 dark:text-gray-400 truncate max-w-full">
                    {account.schoolName}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. Listings Results */}
      {listings.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5 px-1">
            <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> Penawaran & Jasa
          </h3>
          <div className="space-y-3">
            {listings.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Posts Results */}
      {posts.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5 px-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Karya & Showcase
          </h3>
          <div className="space-y-px bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800/80">
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
