import * as React from "react";
import { Link } from "react-router";
import { X } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { cn } from "~/core/utils/cn";

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

export function ListingCard({ listing, onRemove, className, isLink = true }: ListingCardProps) {
  const content = (
    <div className="flex gap-4 min-w-0 w-full relative">
      {/* Thumbnail Image / Fallback */}
      <div className="h-20 w-20 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-100/50 dark:border-gray-700/30">
        {listing.media?.[0] ? (
          <img 
            src={resolveMediaUrl(listing.media[0].objectKey || listing.media[0].url)} 
            alt={listing.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl bg-indigo-50/50 dark:bg-indigo-950/10">📦</div>
        )}
      </div>

      {/* Main Info */}
      <div className="flex flex-col flex-1 min-w-0 pr-16 relative">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {listing.title}
        </h4>
        {listing.description && (
          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mb-1 font-medium">
            {listing.description}
          </p>
        )}
        <p className="font-bold text-indigo-600 dark:text-indigo-400 text-sm mt-auto">
          Rp {listing.price?.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Type Badge on Top Right */}
      <div className={cn(
        "absolute top-0 rounded-md border text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider transition-all duration-200",
        onRemove 
          ? "right-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700" 
          : "right-0 bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100/50 dark:border-indigo-500/10"
      )}>
        {listing.type === "SERVICE" ? "JASA" : "PRODUK"}
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
          className="absolute -top-1 -right-1 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-805 dark:hover:bg-gray-750 transition shrink-0 shadow-sm z-10 border border-gray-200/50 dark:border-gray-700/50"
          title="Hapus tautan"
        >
          <X className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
        </button>
      )}
    </div>
  );

  const baseClassName = "w-full flex gap-4 bg-white dark:bg-gray-900 rounded-3xl p-3.5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-750 transition duration-200 group";

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
