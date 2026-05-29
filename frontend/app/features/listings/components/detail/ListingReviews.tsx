import * as React from "react";
import { Star } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface Reviewer {
  displayName: string;
  username: string;
  avatarObjectKey?: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  reviewer?: Reviewer | null;
}

interface ListingReviewsProps {
  reviews?: Review[] | null;
  reviewsCount: number;
}

export function ListingReviews({ reviews, reviewsCount }: ListingReviewsProps) {
  return (
    <div className="py-6 mt-6 border-t border-border">
      <h3 className="font-bold text-foreground mb-4 text-base flex items-center gap-2">
        Ulasan Pembeli ({reviewsCount || 0})
      </h3>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-3.5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-sm bg-card border border-border/80 space-y-2.5 shadow-sm"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={resolveMediaUrl(rev.reviewer?.avatarObjectKey)}
                    alt={rev.reviewer?.displayName || "Pembeli"}
                    size="sm"
                    className="border border-border"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-foreground leading-none mb-1">
                      {rev.reviewer?.displayName || "Pembeli"}
                    </h5>
                    <span className="text-[9px] text-muted-foreground block leading-none font-bold">
                      @{rev.reviewer?.username || "anonymous"}
                    </span>
                  </div>
                </div>

                {/* Tanggal Ulasan */}
                <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                  {new Date(rev.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Bintang Ulasan */}
              <div className="flex items-center gap-1 text-amber-400">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${
                        s <= rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30 fill-none"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-muted-foreground ml-1">
                  {rev.rating.toFixed(1)}
                </span>
              </div>

              {/* Isi Komentar */}
              {rev.comment ? (
                <p className="text-xs text-muted-foreground leading-relaxed pl-0.5">
                  {rev.comment}
                </p>
              ) : (
                <p className="text-[10px] text-muted-foreground/50 leading-normal pl-0.5 italic">
                  (Tidak ada ulasan tertulis)
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center rounded-sm bg-card border border-border border-dashed">
          <p className="text-xs text-muted-foreground">
            Belum ada ulasan untuk listing ini. Jadilah yang pertama bertransaksi!
          </p>
        </div>
      )}
    </div>
  );
}
