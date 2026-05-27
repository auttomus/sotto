import * as React from "react";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import type { GetFeedQuery } from "~/core/apollo/generated";

type MediaItem = NonNullable<GetFeedQuery["feed"][0]["media"]>[0];

interface PostMediaCarouselProps {
  media: MediaItem[];
}

export function PostMediaCarousel({ media }: PostMediaCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const total = media.length;

  const scrollTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, total - 1));
    setCurrent(clamped);
    scrollRef.current?.children[clamped]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== current) setCurrent(newIndex);
  };

  React.useEffect(() => {
    if (lightboxUrl) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightboxUrl(null);
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        window.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxUrl]);

  if (total === 0) return null;

  if (total === 1) {
    const item = media[0];
    const url = resolveMediaUrl(item.url || (item as any).objectKey);
    return (
      <>
        <div className="rounded-2xl overflow-hidden bg-muted border border-border mt-3 shadow-sm flex items-center justify-center max-h-[512px] w-full cursor-zoom-in group/media">
          <img
            src={url || ""}
            alt={item.fileName || "Post media"}
            className="w-full h-auto max-h-[512px] object-contain rounded-2xl select-none group-hover/media:brightness-95 transition-all duration-200"
            onClick={() => setLightboxUrl(url ?? null)}
            loading="lazy"
          />
        </div>

        {lightboxUrl && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center transition-all animate-fade-in duration-200"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 z-55"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
              <img
                src={lightboxUrl}
                alt="Enlarged media"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoom-in select-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="relative mt-3 group">
        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl border border-border bg-muted aspect-video w-full"
        >
          {media.map((item, i) => {
            const url = resolveMediaUrl(item.url || (item as any).objectKey);
            return (
              <div key={item.id || i} className="w-full shrink-0 snap-center relative h-full cursor-zoom-in group/item">
                <img
                  src={url || ""}
                  alt={item.fileName || `Media ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover/item:brightness-95 transition-all duration-200"
                  onClick={() => setLightboxUrl(url ?? null)}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>

        {/* Prev / Next */}
        {current > 0 && (
          <button
            type="button"
            onClick={() => scrollTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {current < total - 1 && (
          <button
            type="button"
            onClick={() => scrollTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Dots indicator */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center transition-all animate-fade-in duration-200"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 z-55"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="max-w-[95vw] max-h-[95vh] flex items-center justify-center p-4">
            <img
              src={lightboxUrl}
              alt="Enlarged media"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoom-in select-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
