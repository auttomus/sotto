import * as React from "react";
import { Paperclip, Package, Send, Loader2, X, Tag } from "lucide-react";
import { useToastStore } from "~/core/store/useToastStore";
import { MentionSuggestions } from "~/components/ui/MentionSuggestions";
import { MediaPreviewItem } from "~/components/ui/MediaPreviewItem";

interface ChatInputAreaProps {
  inputText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSend: () => void;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  selectedListing: any | null;
  onCancelListing: () => void;
  isUploading: boolean;
  onOpenListingModal: () => void;
  onOpenOfferModal?: () => void;
}

export function ChatInputArea({
  inputText,
  handleInputChange,
  handleKeyDown,
  handleSend,
  selectedImages,
  setSelectedImages,
  selectedListing,
  onCancelListing,
  isUploading,
  onOpenListingModal,
  onOpenOfferModal,
}: ChatInputAreaProps) {
  const addToast = useToastStore((s) => s.addToast);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSend = () => {
    const matches = inputText.match(/\B@[a-zA-Z0-9_]{3,30}\b/g) || [];
    if (matches.length > 5) {
      addToast("error", "Maksimal 5 tag orang diperbolehkan per postingan/pesan");
      return;
    }
    handleSend();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const matches = inputText.match(/\B@[a-zA-Z0-9_]{3,30}\b/g) || [];
      if (matches.length > 5) {
        addToast("error", "Maksimal 5 tag orang diperbolehkan per postingan/pesan");
        return;
      }
    }
    handleKeyDown(e);
  };

  return (
    <div className="shrink-0 bg-card border-t border-border p-3 pb-safe">
      {/* Selected Images Previews */}
      {selectedImages.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto py-1">
          {selectedImages.map((file, idx) => {
            return (
              <div key={idx} className="relative h-16 w-16 rounded-sm overflow-hidden shrink-0 border border-border bg-muted">
                <MediaPreviewItem file={file} />
                <button
                  type="button"
                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Listing Preview */}
      {selectedListing && (
        <div className="mb-3 p-2 bg-primary/5 rounded-sm border border-primary/20 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">{selectedListing.title}</span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Rp {Number(selectedListing.price).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelListing}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Uploading Status */}
      {isUploading && (
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Mengirim media...</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-muted rounded-full pr-1.5 pl-3 py-1.5 relative">
        {/* File Input for Images & Videos */}
        <input
          type="file"
          id="chat-image-input"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setSelectedImages((prev) => [...prev, ...Array.from(e.target.files || [])]);
            }
          }}
        />
        <button 
          type="button"
          onClick={() => document.getElementById("chat-image-input")?.click()}
          className="text-muted-foreground hover:text-primary transition shrink-0 cursor-pointer"
          title="Pilih Gambar atau Video"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Mention Listing Button */}
        <button 
          type="button"
          onClick={onOpenListingModal}
          className="text-muted-foreground hover:text-primary transition shrink-0 cursor-pointer"
          title="Sematkan Listing"
        >
          <Package className="h-5 w-5" />
        </button>

        {/* Custom Offer Button */}
        {onOpenOfferModal && (
          <button 
            type="button"
            onClick={onOpenOfferModal}
            className="text-muted-foreground hover:text-primary transition shrink-0 cursor-pointer"
            title="Buat Penawaran Jasa"
          >
            <Tag className="h-5 w-5" />
          </button>
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 text-foreground placeholder-muted-foreground outline-none"
          placeholder="Ketik pesan..."
          disabled={isUploading}
        />
        
        <MentionSuggestions
          value={inputText}
          onChange={(val) => {
            // Helper onChange custom for input
            const event = {
              target: { value: val }
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(event);
          }}
          inputRef={inputRef}
        />
        
        <button 
          onClick={onSend}
          disabled={(!inputText.trim() && selectedImages.length === 0 && !selectedListing) || isUploading}
          className="bg-primary text-white p-2 rounded-full hover:opacity-90 transition shrink-0 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
