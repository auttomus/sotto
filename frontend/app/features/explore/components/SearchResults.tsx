import * as React from "react";
import { Link } from "react-router";
import { Loader2, Hash, Briefcase, User, Sparkles, Star } from "lucide-react";
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
      <div className="text-center py-16 px-4 bg-card rounded-sm border border-border shadow-sm">
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
        <div className="bg-card p-4 rounded-sm border border-border shadow-sm">
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
                className="bg-card rounded-sm p-5 border border-border shadow-sm flex flex-col items-center text-center hover:shadow-md hover:bg-accent/5 transition-all hover:-translate-y-0.5 cursor-pointer group"
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

                {/* Trust Score Badge */}
                {account.trustScore !== undefined && account.trustScore !== null && (
                  <div className="flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-500 border border-amber-500/20">
                    <Star className="h-2.5 w-2.5 fill-current shrink-0" />
                    <span>{Number(account.trustScore).toFixed(1)}</span>
                  </div>
                )}

                {/* School/Institution & Major */}
                {(account.major || account.schoolName) && (
                  <span className="text-[10px] mt-2 px-2.5 py-0.5 bg-muted rounded-sm border border-border text-muted-foreground truncate max-w-full normal-case font-medium">
                    {account.major ? `${account.major} · ` : ""}{account.schoolName || ""}
                  </span>
                )}

                {/* Short Biography Note */}
                {account.note && (
                  <p className="text-[10px] text-muted-foreground/80 mt-3 px-2 line-clamp-2 leading-relaxed italic border-t border-border/50 pt-2 w-full text-center">
                    "{account.note}"
                  </p>
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
          <div className="space-y-px bg-card rounded-sm overflow-hidden border border-border shadow-sm divide-y divide-border">
            {posts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
