import * as React from "react";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { ChatMessageListing } from "./ChatMessageListing";
import {
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useWithdrawOfferMutation,
} from "~/core/apollo/generated";
import { useToastStore } from "~/core/store/useToastStore";

interface MessageBubbleProps {
  msg: any;
  userAccountId?: string;
  recipientAvatar?: string | null;
  refetchOffers?: () => void;
  onEdit?: (messageId: string, newContent: string) => Promise<void>;
  onDelete?: (messageId: string) => Promise<void>;
}

export function MessageBubble({ msg, userAccountId, recipientAvatar, refetchOffers, onEdit, onDelete }: MessageBubbleProps) {
  const isMine = msg.senderId === userAccountId;
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Regex to parse UUID of mentioned listing in text
  const listingRegex = /\s*\/listing\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\s*/g;
  const match = msg.content?.match(listingRegex);
  const listingId = match ? match[0].match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)?.[0] : null;
  const cleanContent = msg.content?.replace(listingRegex, "").trim();

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
      <div className={`flex gap-2 max-w-[85%] ${isMine ? "self-end flex-row-reverse" : ""} animate-fade-in`}>
        {!isMine && (
          <Avatar
            src={recipientAvatar ? resolveMediaUrl(recipientAvatar) : ""}
            size="sm"
            className="mt-auto shrink-0 h-6 w-6"
          />
        )}
        <div className="bg-muted p-3 rounded-2xl rounded-bl-sm border border-border shadow-sm w-full select-none">
          <p className="text-xs italic text-muted-foreground font-medium">
            Pesan ini telah dihapus
          </p>
          <div className="flex justify-end items-center mt-1.5 text-[8px] text-muted-foreground">
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    );
  }

  // Render Custom Offer Card
  if (msg.isCustomOffer) {
    const offer = msg.offerData;
    const isSeller = offer.sellerAccountId === userAccountId;
    const formattedPrice = Number(offer.proposedPrice).toLocaleString("id-ID");

    return (
      <div className={`flex gap-2 max-w-[85%] ${isSeller ? "self-end" : ""} w-full animate-fade-in`}>
        {!isSeller && (
          <Avatar
            src={recipientAvatar ? resolveMediaUrl(recipientAvatar) : ""}
            size="sm"
            className="mt-auto shrink-0 h-6 w-6"
          />
        )}
        <div className="bg-card border border-border p-4 rounded-3xl shadow-md w-full relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
            <span className="text-[10px] font-bold text-primary tracking-wide uppercase">
              Penawaran Khusus
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              offer.status === "PENDING" ? "bg-primary/10 text-primary" :
              offer.status === "ACCEPTED" ? "bg-success/10 text-success" :
              offer.status === "REJECTED" ? "bg-destructive/10 text-destructive" :
              "bg-muted text-muted-foreground"
            }`}>
              {offer.status === "PENDING" ? "Menunggu" :
               offer.status === "ACCEPTED" ? "Disetujui" :
               offer.status === "REJECTED" ? "Ditolak" : "Ditarik"}
            </span>
          </div>

          <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed mb-4 font-medium">
            {offer.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4 bg-muted p-3 rounded-2xl border border-border">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Harga Kesepakatan</span>
              <span className="text-xs font-extrabold text-primary">Rp {formattedPrice}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Durasi Pengiriman</span>
              <span className="text-xs font-bold text-foreground">{offer.deliveryTimeDays} Hari</span>
            </div>
          </div>

          {offer.status === "PENDING" && (
            <div className="flex gap-2">
              {!isSeller ? (
                <>
                  <button
                    onClick={() => rejectOffer({ variables: { offerId: offer.id } })}
                    disabled={actionLoading}
                    className="flex-1 py-2 text-center text-[11px] font-bold text-destructive border border-destructive/30 hover:bg-destructive/10 rounded-xl transition cursor-pointer disabled:opacity-50"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => acceptOffer({ variables: { offerId: offer.id } })}
                    disabled={actionLoading}
                    className="flex-[2] py-2 text-center text-[11px] font-bold bg-primary hover:opacity-90 text-primary-foreground rounded-xl shadow-md shadow-primary/10 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                  >
                    Terima & Bayar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => withdrawOffer({ variables: { offerId: offer.id } })}
                  disabled={actionLoading}
                  className="w-full py-2 text-center text-[11px] font-bold text-muted-foreground border border-border hover:bg-muted rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  Tarik Penawaran
                </button>
              )}
            </div>
          )}

          {offer.status === "ACCEPTED" && offer.orderId && !isSeller && (
            <button
              onClick={() => navigate(`/workspace/order/${offer.orderId}`)}
              className="w-full py-2 text-center text-[11px] font-bold text-primary border border-primary/30 hover:bg-primary/5 rounded-xl transition cursor-pointer"
            >
              Lihat Detail Order
            </button>
          )}

          <div className="flex justify-end items-center mt-2.5 text-[8px] text-muted-foreground">
            {new Date(offer.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 max-w-[85%] ${isMine ? 'self-end flex-row-reverse' : ''} group relative items-center`}>
      {!isMine && (
        <Avatar 
          src={recipientAvatar ? resolveMediaUrl(recipientAvatar) : ""} 
          size="sm" 
          className="mt-auto shrink-0 h-6 w-6" 
        />
      )}
      
      {/* Edit/Delete options menu for own messages */}
      {isMine && !msg.isCustomOffer && !isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center shrink-0 relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }} 
            className="p-1 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute bottom-full right-0 mb-1 z-30 bg-card border border-border rounded-xl shadow-lg p-1 min-w-[90px] flex flex-col gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-bold text-foreground hover:bg-muted rounded-lg text-left w-full cursor-pointer"
              >
                <Pencil className="h-3 w-3" />
                Ubah
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
                    await onDelete?.(msg.messageId);
                    addToast("success", "Pesan berhasil dihapus");
                  }
                  setShowMenu(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-bold text-destructive hover:bg-destructive/10 rounded-lg text-left w-full cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                Hapus
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`${isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border rounded-bl-sm'} p-3 rounded-2xl shadow-sm w-full`}>
        {isEditing ? (
          <div className="flex flex-col gap-2 min-w-[200px]">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full text-sm bg-muted text-foreground rounded-xl p-2 border border-border focus:outline-none focus:border-primary/50 resize-none font-medium"
              rows={2}
            />
            <div className="flex justify-end gap-1">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(cleanContent || "");
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  let finalContent = editContent.trim();
                  if (listingId) {
                    finalContent = `${finalContent}\n/listing/${listingId}`;
                  }
                  if (finalContent && finalContent !== msg.content) {
                    await onEdit?.(msg.messageId, finalContent);
                    addToast("success", "Pesan berhasil diubah");
                  }
                  setIsEditing(false);
                }}
                className="px-3 py-1 text-[11px] font-bold bg-primary text-primary-foreground rounded-lg hover:opacity-90 shadow-sm active:scale-[0.98] transition cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        ) : (
          cleanContent && (
            <p className={`text-sm ${isMine ? 'text-primary-foreground font-medium' : 'text-foreground'} whitespace-pre-wrap break-words`}>
              {cleanContent}
            </p>
          )
        )}

        {/* Display listing attachment if mentioned */}
        {listingId && <ChatMessageListing listingId={listingId} />}

        {/* Display media attachments (Images) */}
        {!msg.deletedAt && msg.media && msg.media.length > 0 && (
          <div className="mt-2 space-y-2">
            {msg.media.map((item: any) => {
              const url = resolveMediaUrl(item.url || item.objectKey);
              return (
                <div 
                  key={item.id} 
                  className="rounded-xl overflow-hidden max-w-full bg-muted border border-border max-h-[220px] flex items-center justify-center cursor-zoom-in group/media"
                  onClick={() => window.open(url, '_blank')}
                >
                  <img
                    src={url || ""}
                    alt={item.fileName || "Gambar chat"}
                    className="w-full h-auto max-h-[220px] object-cover rounded-xl select-none group-hover/media:brightness-95 transition-all duration-200"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-1.5">
          {msg.editedAt && (
            <span className={`text-[8px] italic mr-1 ${isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              (diedit)
            </span>
          )}
          <span className={`text-[9px] ${isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMine && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
      </div>
    </div>
  );
}
