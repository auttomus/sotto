import * as React from "react";
import { Link } from "react-router";
import { Loader2, Hash, Briefcase, User, Sparkles } from "lucide-react";
import { PostCard } from "~/features/feed/components/PostCard";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { LabelBadge } from "~/components/ui/LabelBadge";

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasResults = accounts.length > 0 || listings.length > 0 || posts.length > 0 || tags.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-16 px-4 bg-card rounded-3xl border border-border shadow-sm">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-foreground font-medium">Tidak ada hasil ditemukan</p>
        <p className="text-sm text-muted-foreground mt-1">Coba gunakan kata kunci lain untuk "{searchQuery}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Tag Results */}
      {tags.length > 0 && (
        <div className="bg-card p-4 rounded-3xl border border-border shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-primary" /> Topik & Tag
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagClick?.(tag.name)}
                className="hover:-translate-y-0.5 hover:shadow-sm transition-all cursor-pointer"
              >
                <LabelBadge variant="tag" value={tag.name} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Accounts Results */}
      {accounts.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 px-1">
            <User className="h-3.5 w-3.5 text-primary" /> Talenta & Kreator
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {accounts.map((account) => (
              <Link 
                to={`/profile/${account.username}`} 
                key={account.id} 
                className="bg-card rounded-3xl p-5 border border-border shadow-sm flex flex-col items-center text-center hover:shadow-md hover:bg-accent/5 transition-all hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="h-16 w-16 rounded-full bg-muted mb-3 overflow-hidden border-2 border-border shadow-inner shrink-0 group-hover:scale-105 transition duration-200">
                  {account.avatarObjectKey ? (
                    <img 
                      src={resolveMediaUrl(account.avatarObjectKey)} 
                      alt={account.displayName} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                      {account.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {account.displayName}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">@{account.username}</p>
                {account.schoolName && (
                  <span className="text-[10px] mt-2 px-2 py-0.5 bg-muted rounded-md border border-border text-muted-foreground truncate max-w-full">
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 px-1">
            <Briefcase className="h-3.5 w-3.5 text-primary" /> Penawaran & Jasa
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 px-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Karya & Showcase
          </h3>
          <div className="space-y-px bg-card rounded-3xl overflow-hidden border border-border shadow-sm divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
