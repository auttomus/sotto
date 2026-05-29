import * as React from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/Button";

interface OrderReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  loading: boolean;
}

export function OrderReviewForm({ onSubmit, loading }: OrderReviewFormProps) {
  const [rating, setRating] = React.useState<number>(0);
  const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);
  const [comment, setComment] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Silakan pilih rating bintang terlebih dahulu.");
      return;
    }
    setError(null);
    onSubmit(rating, comment);
  };

  return (
    <div className="bg-card p-5 rounded-sm border border-border shadow-sm space-y-4 text-foreground">
      <div className="border-b border-border pb-3 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h4 className="font-extrabold text-sm text-foreground">
          Beri Ulasan Transaksi
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Selector */}
        <div className="flex flex-col items-center justify-center py-2.5 bg-muted/40 rounded border border-dashed border-border/80">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Bagaimana kualitas pelayanan/produk?
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoveredRating !== null ? star <= hoveredRating : star <= rating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setError(null);
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="p-1 rounded-full hover:bg-muted/95 active:scale-95 transition cursor-pointer"
                >
                  <Star
                    className={`h-8 w-8 transition-colors duration-150 ${
                      active
                        ? "fill-amber-400 text-amber-400 scale-110"
                        : "text-muted-foreground/60 fill-none"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {rating > 0 && (
            <span className="text-xs font-semibold text-primary mt-2">
              {rating === 5
                ? "Sangat Bagus! ⭐⭐⭐⭐⭐"
                : rating === 4
                ? "Bagus! ⭐⭐⭐⭐"
                : rating === 3
                ? "Cukup Oke ⭐⭐⭐"
                : rating === 2
                ? "Kurang Memuaskan ⭐⭐"
                : "Sangat Buruk ⭐"}
            </span>
          )}
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label
            htmlFor="comment"
            className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
          >
            Komentar / Catatan Tambahan (Opsional)
          </label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tuliskan ulasan Anda mengenai keahlian seller atau kelengkapan produk digital..."
            className="w-full text-xs p-3 bg-background border border-border rounded-sm focus:border-primary focus:outline-none transition leading-relaxed text-foreground placeholder:text-muted-foreground/50 resize-none"
          />
        </div>

        {error && (
          <p className="text-[10px] font-bold text-destructive bg-destructive/5 p-2.5 rounded border border-destructive/10">
            ⚠️ {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading || rating === 0}
          className="w-full font-bold text-xs py-2.5 rounded-sm bg-primary hover:opacity-90 text-primary-foreground border-0 shadow-lg shadow-primary/10 active:scale-[0.99] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Mengirimkan Ulasan...</span>
            </>
          ) : (
            <span>Kirim Ulasan & Selesaikan</span>
          )}
        </Button>
      </form>
    </div>
  );
}
