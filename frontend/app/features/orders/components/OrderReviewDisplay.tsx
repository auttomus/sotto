import * as React from "react";
import { Star, MessageSquare } from "lucide-react";

interface OrderReviewDisplayProps {
  review: {
    rating: number;
    comment?: string | null;
  };
}

export function OrderReviewDisplay({ review }: OrderReviewDisplayProps) {
  return (
    <div className="bg-card p-5 rounded-sm border border-border shadow-sm space-y-3.5 text-foreground">
      <div className="border-b border-border pb-2.5 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-success" />
        <h4 className="font-extrabold text-sm text-foreground">
          Ulasan Anda
        </h4>
      </div>

      <div className="space-y-3">
        {/* Rating Stars (Read-Only) */}
        <div className="flex items-center gap-1.5 bg-muted/40 px-3.5 py-2.5 rounded border border-border/60 w-fit">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= review.rating;
              return (
                <Star
                  key={star}
                  className={`h-4.5 w-4.5 ${
                    active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 fill-none"
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border ml-1">
            {review.rating.toFixed(1)} / 5.0
          </span>
        </div>

        {/* Comment Text */}
        {review.comment ? (
          <div className="p-3 bg-background border border-border rounded-sm">
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground leading-normal italic pl-1">
            (Tidak ada ulasan tertulis)
          </p>
        )}
      </div>
    </div>
  );
}
