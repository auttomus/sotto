import * as React from "react";
import { Image, Briefcase, X, Loader2, Send } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { MentionSuggestions } from "~/components/ui/MentionSuggestions";
import { ListingCard } from "~/features/listings/components/ListingCard";
import { useToastStore } from "~/core/store/useToastStore";
import { MediaPreviewItem } from "~/components/ui/MediaPreviewItem";

interface ReplyInputFormProps {
  currentUser: any;
  replyText: string;
  setReplyText: (text: string) => void;
  replyFiles: File[];
  setReplyFiles: (files: File[]) => void;
  selectedListing: any;
  setReplyListingId: (id: string | null) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  setShowListingSelector: (show: boolean) => void;
}

export function ReplyInputForm({
  currentUser,
  replyText,
  setReplyText,
  replyFiles,
  setReplyFiles,
  selectedListing,
  setReplyListingId,
  submitting,
  onSubmit,
  setShowListingSelector,
}: ReplyInputFormProps) {
  const addToast = useToastStore((s) => s.addToast);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (replyFiles.length + newFiles.length > 5) {
        addToast("error", "Maksimal 5 file diperbolehkan");
        return;
      }
      setReplyFiles([...replyFiles, ...newFiles]);
    }
  };

  return (
    <div className="p-4 border-b border-border bg-background">
      <form onSubmit={onSubmit} className="flex gap-3 items-start">
        <Avatar src={resolveMediaUrl(currentUser.avatarObjectKey)} size="sm" />
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Balas postingan ini..."
            rows={2}
            className="w-full bg-transparent border-0 resize-none text-foreground placeholder-muted-foreground focus:ring-0 text-sm focus:outline-none font-medium leading-relaxed mb-1 p-0"
          />
          <MentionSuggestions
            value={replyText}
            onChange={setReplyText}
            inputRef={textareaRef}
          />

          {/* Selected images inline preview */}
          {replyFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {replyFiles.map((file, i) => (
                <div key={i} className="relative w-16 h-16 rounded-sm overflow-hidden border border-border bg-muted">
                  <MediaPreviewItem file={file} />
                  <button
                    type="button"
                    onClick={() => setReplyFiles(replyFiles.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-0.5 rounded-full transition cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Attached Listing Card Preview */}
          {selectedListing && (
            <div className="mt-2 mb-3 relative">
              <ListingCard listing={selectedListing as any} isLink={false} className="border-primary/20 bg-card" />
              <button
                type="button"
                onClick={() => setReplyListingId(null)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition shadow cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
          />

          <div className="flex items-center justify-between border-t border-border pt-2.5 mt-2">
            {/* Media and Listing Attachment Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full text-primary hover:bg-primary/10 transition cursor-pointer"
                title="Tambah Gambar"
              >
                <Image className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowListingSelector(true)}
                className="p-2 rounded-full text-primary hover:bg-primary/10 transition cursor-pointer"
                title="Sematkan Penawaran"
              >
                <Briefcase className="h-4 w-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={(!replyText.trim() && replyFiles.length === 0) || submitting}
              className="px-4 py-1.5 rounded-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-[0.97]"
            >
              {submitting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
              Balas
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
