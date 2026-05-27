import * as React from "react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";

interface CustomOfferCardProps {
  msg: any;
  userAccountId: string;
  recipientAvatar?: string | null;
  actionLoading: boolean;
  rejectOffer: (options: any) => any;
  acceptOffer: (options: any) => any;
  withdrawOffer: (options: any) => any;
  navigate: (path: string) => void;
}

export function CustomOfferCard({
  msg,
  userAccountId,
  recipientAvatar,
  actionLoading,
  rejectOffer,
  acceptOffer,
  withdrawOffer,
  navigate,
}: CustomOfferCardProps) {
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
                  type="button"
                  onClick={() => rejectOffer({ variables: { offerId: offer.id } })}
                  disabled={actionLoading}
                  className="flex-1 py-2 text-center text-[11px] font-bold text-destructive border border-destructive/30 hover:bg-destructive/10 rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={() => acceptOffer({ variables: { offerId: offer.id } })}
                  disabled={actionLoading}
                  className="flex-[2] py-2 text-center text-[11px] font-bold bg-primary hover:opacity-90 text-primary-foreground rounded-xl shadow-md shadow-primary/10 active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
                >
                  Terima & Bayar
                </button>
              </>
            ) : (
              <button
                type="button"
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
            type="button"
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
