import * as React from "react";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { ChatMessageListing } from "./ChatMessageListing";
import { ChatMessagePost } from "./ChatMessagePost";
import {
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useWithdrawOfferMutation,
} from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";
import { formatMentions } from "~/core/utils/formatMentions";
import { DeletedMessageTombstone } from "./message/DeletedMessageTombstone";
import { CustomOfferCard } from "./message/CustomOfferCard";
import { ChatMessageMedia } from "./message/ChatMessageMedia";

interface MessageBubbleProps {
  msg: any;
  userAccountId?: string;
  recipientAvatar?: string | null;
  recipientLastReadTime?: number | null;
  refetchOffers?: () => void;
  onEdit?: (messageId: string, newContent: string) => Promise<void>;
  onDelete?: (messageId: string) => Promise<void>;
}

export function MessageBubble({ msg, userAccountId, recipientAvatar, recipientLastReadTime, refetchOffers, onEdit, onDelete }: MessageBubbleProps) {
  const isMine = msg.senderId === userAccountId;
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  // Regex untuk memilah UUID Listing atau Postingan yang disebut di dalam pesan
  const listingRegex = /\s*\/listing\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\s*/g;
  const postRegex = /\s*\/post\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\s*/g;

  const matchListing = msg.content?.match(listingRegex);
  const listingId = matchListing ? matchListing[0].match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)?.[0] : null;

  const matchPost = msg.content?.match(postRegex);
  const postId = matchPost ? matchPost[0].match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)?.[0] : null;

  const cleanContent = msg.content
    ?.replace(listingRegex, "")
    ?.replace(postRegex, "")
    ?.trim();

  const [editContent, setEditContent] = React.useState(cleanContent || "");

  React.useEffect(() => {
    if (!showMenu) return;
    const handleClose = () => setShowMenu(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [showMenu]);

  const [acceptOffer, { loading: accepting }] = useAcceptOfferMutation({
    onCompleted: (res: any) => {
      addToast("success", "Penawaran diterima! Mengalihkan ke pembayaran...");
      refetchOffers?.();
      if (res.acceptOffer?.orderId) {
        navigate(`/workspace/order/${res.acceptOffer.orderId}`);
      }
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const [rejectOffer, { loading: rejecting }] = useRejectOfferMutation({
    onCompleted: () => {
      addToast("success", "Penawaran berhasil ditolak.");
      refetchOffers?.();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const [withdrawOffer, { loading: withdrawing }] = useWithdrawOfferMutation({
    onCompleted: () => {
      addToast("success", "Penawaran berhasil ditarik.");
      refetchOffers?.();
    },
    onError: (e: any) => addToast("error", e.message),
  });

  const actionLoading = accepting || rejecting || withdrawing;

  // Render deleted message tombstone
  if (msg.deletedAt) {
    return (
      <DeletedMessageTombstone
        msg={msg}
        isMine={isMine}
        recipientAvatar={recipientAvatar}
      />
    );
  }

  // Render Custom Offer Card
  if (msg.isCustomOffer) {
    return (
      <CustomOfferCard
        msg={msg}
        userAccountId={userAccountId || ""}
        recipientAvatar={recipientAvatar}
        actionLoading={actionLoading}
        rejectOffer={rejectOffer}
        acceptOffer={acceptOffer}
        withdrawOffer={withdrawOffer}
        navigate={navigate}
      />
    );
  }

  return (
    <>
      <div className={`flex gap-2 max-w-[85%] ${isMine ? 'self-end flex-row-reverse' : ''} group relative items-center`}>
        {!isMine && (
          <Avatar 
            src={recipientAvatar ? resolveMediaUrl(recipientAvatar) : ""} 
            size="sm" 
            className="mt-auto shrink-0 h-6 w-6" 
          />
        )}
        
        {/* Menu opsi ubah/hapus untuk pesan sendiri */}
        {isMine && !msg.isCustomOffer && !isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center shrink-0 relative animate-fade-in">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showMenu && (
              <div 
                className="absolute right-0 bottom-full mb-1 z-35 bg-popover text-popover-foreground border border-border rounded-sm shadow-lg p-1 min-w-[100px] flex flex-col gap-0.5 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold hover:bg-accent hover:text-accent-foreground rounded-lg text-left w-full cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                  Sunting
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
                      await onDelete?.(msg.messageId);
                    }
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold text-destructive hover:bg-destructive/10 rounded-lg text-left w-full cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus
                </button>
              </div>
            )}
          </div>
        )}

        {/* Kotak gelembung pesan */}
        <div className={`p-3 rounded-sm shadow-sm ${
          isMine 
            ? 'bg-primary text-primary-foreground rounded-br-sm' 
            : 'bg-card border border-border text-foreground rounded-bl-sm'
        }`}>
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-background text-foreground border border-border rounded-sm px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                autoFocus
              />
              <div className="flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(cleanContent || "");
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (editContent.trim() && editContent.trim() !== cleanContent) {
                      await onEdit?.(msg.messageId, editContent.trim());
                    }
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-[0.97] transition cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </div>
          ) : (
            cleanContent && (
              <p className={`text-sm ${isMine ? 'text-primary-foreground font-medium' : 'text-foreground'} whitespace-pre-wrap break-words`}>
                {formatMentions(cleanContent, isMine)}
              </p>
            )
          )}

          {/* Render tautan Listing yang disematkan */}
          {listingId && <ChatMessageListing listingId={listingId} />}

          {/* Render tautan Postingan yang disematkan */}
          {postId && <ChatMessagePost postId={postId} />}

          {/* Render lampiran gambar-gambar */}
          <ChatMessageMedia media={msg.media} />

          <div className="flex items-center justify-end gap-1 mt-1.5">
            {msg.editedAt && (
              <span className={`text-[8px] italic mr-1 ${isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                (diedit)
              </span>
            )}
            <span className={`text-[9px] ${isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isMine && (() => {
              const isLocal = msg.messageId.startsWith("local-");
              const isRead = recipientLastReadTime && new Date(msg.createdAt).getTime() <= recipientLastReadTime;
              
              if (isLocal) {
                return <Check className="h-3 w-3 text-primary-foreground/50 animate-pulse" />;
              }
              
              if (isRead) {
                return (
                  <div className="flex -space-x-1.5 items-center">
                    <Check className="h-3 w-3 text-sky-300 stroke-[2.5]" />
                    <Check className="h-3 w-3 text-sky-300 stroke-[2.5]" />
                  </div>
                );
              }
              
              return (
                <div className="flex -space-x-1.5 items-center">
                  <Check className="h-3 w-3 text-primary-foreground/60" />
                  <Check className="h-3 w-3 text-primary-foreground/60" />
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
