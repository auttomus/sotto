import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface ListingMediaGalleryProps {
  media: any[];
  title: string;
  isFullyBooked: boolean;
}

export function ListingMediaGallery({ media, title, isFullyBooked }: ListingMediaGalleryProps) {
  const [currentMedia, setCurrentMedia] = React.useState(0);
  const hasMedia = media && media.length > 0;

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMedia(prev => (prev > 0 ? prev - 1 : media.length - 1));
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMedia(prev => (prev < media.length - 1 ? prev + 1 : 0));
  };

  if (!hasMedia) {
    return (
      <div className="w-full aspect-video bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
        <span className="text-4xl"></span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <img 
        src={resolveMediaUrl(media[currentMedia].url || (media[currentMedia] as any).objectKey)} 
        alt={title}
        className="w-full h-full object-cover"
      />
      
      {/* Carousel Controls */}
      {media.length > 1 && (
        <>
          <button 
            type="button"
            onClick={handlePrevMedia}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            type="button"
            onClick={handleNextMedia}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-sm transition cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
            {media.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${i === currentMedia ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}

      {isFullyBooked && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-lg rotate-[-5deg] shadow-xl border-2 border-white/20 select-none">
            FULLY BOOKED
          </div>
        </div>
      )}
    </div>
  );
}
