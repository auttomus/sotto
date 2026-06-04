import * as React from "react";
import { X } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface ChatMessageMediaProps {
  media: any[];
}

export function ChatMessageMedia({ media }: ChatMessageMediaProps) {
  const [lightboxUrl, setLightboxUrl] = React.useState<string | null>(null);

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

  if (!media || media.length === 0) return null;

  return (
    <>
      <div className="mt-2 space-y-2">
        {media.map((item: any) => {
          const url = resolveMediaUrl(item.url || item.objectKey);
          const isVideo = item.contentType?.startsWith("video/") || /\.(mp4|webm|ogg|mov)$/i.test(item.fileName || "");

          if (isVideo) {
            return (
              <div 
                key={item.id} 
                className="rounded-sm overflow-hidden max-w-full bg-black border border-border max-h-[280px] flex items-center justify-center relative group/media"
              >
                <video
                  src={url || ""}
                  controls
                  className="w-full h-auto max-h-[280px] rounded-sm select-none object-contain"
                  preload="metadata"
                  playsInline
                />
              </div>
            );
          }

          return (
            <div 
              key={item.id} 
              className="rounded-sm overflow-hidden max-w-full bg-muted border border-border max-h-[220px] flex items-center justify-center cursor-zoom-in group/media"
              onClick={() => setLightboxUrl(url ?? null)}
            >
              <img
                src={url || ""}
                alt={item.fileName || "Gambar chat"}
                className="w-full h-auto max-h-[220px] object-cover rounded-sm select-none group-hover/media:brightness-95 transition-all duration-200"
              />
            </div>
          );
        })}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center transition-all animate-fade-in duration-200"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxUrl(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 z-10 cursor-pointer"
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
