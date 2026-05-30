import * as React from "react";
import { Link } from "react-router";
import { X } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { cn } from "~/core/utils/cn";
import { LabelBadge } from "~/components/ui/LabelBadge";

export interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    type: string;
    media?: Array<{ url: string; objectKey?: string | null }> | null;
  };
  onRemove?: () => void;
  className?: string;
  isLink?: boolean;
}

function isVideoFile(path: string | null | undefined): boolean {
  if (!path) return false;
  const ext = path.split('.').pop()?.toLowerCase();
  return ['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v', '3gp', 'ogv'].includes(ext || '');
}

export function ListingCard({ listing, onRemove, className, isLink = true }: ListingCardProps) {
  const mediaUrl = listing.media?.[0] ? resolveMediaUrl(listing.media[0].objectKey || listing.media[0].url) : null;
  const isVideo = listing.media?.[0] ? isVideoFile(listing.media[0].objectKey || listing.media[0].url) : false;

  const content = (
    <div className="flex gap-4 min-w-0 w-full relative">
      {/* Thumbnail Image / Fallback */}
      <div className="h-20 w-20 rounded-sm bg-muted overflow-hidden shrink-0 border border-border">
        {mediaUrl ? (
          isVideo ? (
            <video 
              src={mediaUrl} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img 
              src={mediaUrl} 
              alt={listing.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl bg-accent">📦</div>
        )}
      </div>

      {/* Main Info */}
      <div className="flex flex-col flex-1 min-w-0 pr-16 relative">
        <h4 className="font-semibold text-foreground text-sm mb-0.5 line-clamp-1 group-hover:text-primary transition-colors">
          {listing.title}
        </h4>
        {listing.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-1 mb-1 font-medium">
            {listing.description}
          </p>
        )}
        <p className="font-bold text-primary text-sm mt-auto">
          Rp {listing.price?.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Type Badge on Top Right */}
      <div className={cn("absolute top-0", onRemove ? "right-8" : "right-0")}>
        <LabelBadge
          variant={listing.type === "SERVICE" ? "listing-service" : "listing-product"}
          value={listing.type}
        />
      </div>

      {/* Close Button if onRemove provided */}
      {onRemove && (
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -right-1 p-1.5 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition shrink-0 shadow-sm z-10 border border-border"
          title="Hapus tautan"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );

  const baseClassName = "w-full flex gap-4 bg-card rounded-sm p-3.5 border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition duration-200 group";

  if (isLink && !onRemove) {
    return (
      <Link to={`/listing/${listing.id}`} className={cn(baseClassName, className)}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cn(baseClassName, className)}>
      {content}
    </div>
  );
}
