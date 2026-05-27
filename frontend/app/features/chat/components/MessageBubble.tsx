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
        <div className="bg-gray-150 dark:bg-gray-800/40 p-3 rounded-2xl rounded-bl-sm dark:border dark:border-gray-800/60 shadow-sm w-full select-none">
          <p className="text-xs italic text-gray-400 dark:text-gray-500 font-medium">
            Pesan ini telah dihapus
          </p>
          <div className="flex justify-end items-center mt-1.5 text-[8px] text-gray-400 dark:text-gray-500">
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
        <div className="bg-white dark:bg-gray-900 border-2 border-indigo-500/20 dark:border-indigo-500/10 p-4 rounded-3xl shadow-md w-full relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
              Penawaran Khusus
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              offer.status === "PENDING" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
              offer.status === "ACCEPTED" ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
              offer.status === "REJECTED" ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
              "bg-gray-100 text-gray-500 dark:bg-gray-850 dark:text-gray-400"
            }`}>
              {offer.status === "PENDING" ? "Menunggu" :
               offer.status === "ACCEPTED" ? "Disetujui" :
               offer.status === "REJECTED" ? "Ditolak" : "Ditarik"}
            </span>
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed mb-4 font-medium">
            {offer.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 dark:bg-gray-850 p-3 rounded-2xl border border-gray-100/50 dark:border-gray-800/30">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Harga Kesepakatan</span>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">Rp {formattedPrice}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Durasi Pengiriman</span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{offer.deliveryTimeDays} Hari</span>
            </div>
          </div>

          {offer.status === "PENDING" && (
            <div className="flex gap-2">
              {!isSeller ? (
                <>
                  <button
                    onClick={() => rejectOffer({ variables: { offerId: offer.id } })}
                    disabled={actionLoading}
                    className="flex-1 py-2 text-center text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition cursor-pointer disabled:opacity-50"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => acceptOffer({ variables: { offerId: offer.id } })}
                    disabled={actionLoading}
                    className="flex-[2] py-2 text-center text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                  >
                    Terima & Bayar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => withdrawOffer({ variables: { offerId: offer.id } })}
                  disabled={actionLoading}
                  className="w-full py-2 text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  Tarik Penawaran
                </button>
              )}
            </div>
          )}

          {offer.status === "ACCEPTED" && offer.orderId && !isSeller && (
            <button
              onClick={() => navigate(`/workspace/order/${offer.orderId}`)}
              className="w-full py-2 text-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition cursor-pointer"
            >
              Lihat Detail Order
            </button>
          )}

          <div className="flex justify-end items-center mt-2.5 text-[8px] text-gray-400 dark:text-gray-500">
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
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute bottom-full right-0 mb-1 z-30 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl shadow-lg p-1 min-w-[90px] flex flex-col gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left w-full cursor-pointer"
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
                className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-left w-full cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                Hapus
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`${isMine ? 'bg-indigo-600 rounded-br-sm' : 'bg-white dark:bg-gray-800 rounded-bl-sm border border-gray-100 dark:border-gray-700/50'} p-3 rounded-2xl shadow-sm w-full`}>
        {isEditing ? (
          <div className="flex flex-col gap-2 min-w-[200px]">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full text-sm bg-black/10 dark:bg-black/20 text-white rounded-xl p-2 border border-white/20 focus:outline-none focus:border-white/50 resize-none font-medium"
              rows={2}
            />
            <div className="flex justify-end gap-1">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(cleanContent || "");
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-200 hover:text-white transition cursor-pointer"
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
                className="px-3 py-1 text-[11px] font-bold bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 shadow-sm active:scale-[0.98] transition cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        ) : (
          cleanContent && (
            <p className={`text-sm ${isMine ? 'text-white font-medium' : 'text-gray-800 dark:text-gray-200'} whitespace-pre-wrap break-words`}>
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
                  className="rounded-xl overflow-hidden max-w-full bg-gray-50 border border-gray-150 dark:border-gray-800 max-h-[220px] flex items-center justify-center cursor-zoom-in group/media"
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

        <div className={`flex items-center justify-end gap-1 mt-1.5 ${!isMine ? 'text-right' : ''}`}>
          {msg.editedAt && (
            <span className={`text-[8px] italic mr-1 ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
              (diedit)
            </span>
          )}
          <span className={`text-[9px] ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMine && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
    </div>
  );
}
