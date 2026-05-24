import * as React from "react";
import { Paperclip, Package, Send, Loader2, X } from "lucide-react";

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
}: ChatInputAreaProps) {
  return (
    <div className="shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-3 pb-safe">
      {/* Selected Images Previews */}
      {selectedImages.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto py-1">
          {selectedImages.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div key={idx} className="relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
                <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
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
        <div className="mb-3 p-2 bg-indigo-50/50 dark:bg-indigo-950/15 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{selectedListing.title}</span>
              <span className="text-[10px] text-gray-500 font-medium">
                Rp {Number(selectedListing.price).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancelListing}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Uploading Status */}
      {isUploading && (
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Mengirim gambar...</span>
        </div>
      )}

      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pr-1.5 pl-3 py-1.5">
        {/* File Input for Images */}
        <input
          type="file"
          id="chat-image-input"
          accept="image/*"
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
          className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shrink-0 cursor-pointer"
          title="Pilih Gambar"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Mention Listing Button */}
        <button 
          type="button"
          onClick={onOpenListingModal}
          className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shrink-0 cursor-pointer"
          title="Sematkan Listing"
        >
          <Package className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-1 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none"
          placeholder="Ketik pesan..."
          disabled={isUploading}
        />
        
        <button 
          onClick={handleSend}
          disabled={(!inputText.trim() && selectedImages.length === 0 && !selectedListing) || isUploading}
          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shrink-0 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
