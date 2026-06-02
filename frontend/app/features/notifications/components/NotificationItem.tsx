import * as React from "react";
import { UserPlus, ShoppingBag, MessageCircle, AtSign, Star } from "lucide-react";
import { Link } from "react-router";
import type { NotificationType } from "~/core/apollo/base-types";

interface NotificationItemProps {
  id: string;
  type: NotificationType;
  targetType?: string | null;
  targetId?: string | null;
  fromDisplayName?: string | null;
  fromUsername?: string | null;
  fromAccountId?: string | null;
  isRead: boolean;
  createdAt: string;
  onMarkAsRead: (id: string) => void;
}

/** Ikon berdasarkan tipe notifikasi */
function NotifIcon({ type, targetType }: { type: NotificationType; targetType?: string | null }) {
  const base = "h-5 w-5";
  if (targetType && targetType.startsWith("CustomOffer")) {
    return <MessageCircle className={`${base} text-violet-500`} />;
  }
  if (targetType === "Review") {
    return <Star className={`${base} text-amber-500`} />;
  }
  switch (type) {
    case "FOLLOW":
      return <UserPlus className={`${base} text-blue-500`} />;
    case "ORDER_UPDATE":
      return <ShoppingBag className={`${base} text-emerald-500`} />;
    case "NEW_MESSAGE":
      return <MessageCircle className={`${base} text-violet-500`} />;
    case "MENTION":
      return <AtSign className={`${base} text-amber-500`} />;
    default:
      return <MessageCircle className={`${base} text-muted-foreground`} />;
  }
}

/** Pesan deskriptif untuk setiap tipe notifikasi */
function getNotifMessage(type: NotificationType, fromName: string, targetType?: string | null): string {
  if (targetType === "CustomOffer_Created") {
    return `${fromName} mengirimkan penawaran khusus`;
  }
  if (targetType === "CustomOffer_Accepted") {
    return `${fromName} menyetujui penawaran khusus Anda`;
  }
  if (targetType === "CustomOffer_Rejected") {
    return `${fromName} menolak penawaran khusus Anda`;
  }
  if (targetType === "CustomOffer_Withdrawn") {
    return `${fromName} menarik penawaran khusus`;
  }
  if (targetType === "Review") {
    return `${fromName} memberikan ulasan untuk pesanan Anda`;
  }
  switch (type) {
    case "FOLLOW":
      return `${fromName} mulai mengikuti Anda`;
    case "ORDER_UPDATE":
      return `${fromName} memperbarui pesanan`;
    case "NEW_MESSAGE":
      return `${fromName} mengirim pesan baru`;
    case "MENTION":
      return `${fromName} membalas postingan Anda`;
    default:
      return `${fromName} mengirimkan notifikasi`;
  }
}

/** Link target berdasarkan targetType */
function getTargetLink(
  targetType?: string | null,
  targetId?: string | null,
  fromUsername?: string | null,
  type?: NotificationType,
): string {
  if (!targetType || !targetId) return "/notifications";
  if (targetType.startsWith("CustomOffer")) {
    return `/workspace/chat/${targetId}`;
  }
  switch (targetType) {
    case "Order":
      return `/workspace/order/${targetId}`;
    case "Review":
      return `/workspace/order/${targetId}`;
    case "CustomOffer":
      return `/workspace/chat/${targetId}`;
    case "ScyllaPost":
      return `/post/${targetId}`;
    case "Account":
      return `/profile/${fromUsername}`;
    default:
      return "/notifications";
  }
}

/** Relative time formatter */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);

  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}h`;
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export function NotificationItem({
  id,
  type,
  targetType,
  targetId,
  fromDisplayName,
  fromUsername,
  fromAccountId,
  isRead,
  createdAt,
  onMarkAsRead,
}: NotificationItemProps) {
  const name = fromDisplayName || "Seseorang";
  const link = getTargetLink(targetType, targetId, fromUsername || targetId, type);

  return (
    <Link
      to={link}
      onClick={() => {
        if (!isRead) onMarkAsRead(id);
      }}
      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 border-b border-border ${
        !isRead ? "bg-primary/5" : ""
      }`}
    >
      {/* Ikon */}
      <div className="mt-0.5 flex-shrink-0 p-2 rounded-full bg-muted">
        <NotifIcon type={type} targetType={targetType} />
      </div>

      {/* Konten */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            !isRead ? "font-semibold text-foreground" : "text-muted-foreground"
          }`}
        >
          {getNotifMessage(type, name, targetType)}
        </p>
        <span className="text-xs text-muted-foreground mt-0.5 block">
          {timeAgo(createdAt)}
        </span>
      </div>

      {/* Unread dot */}
      {!isRead && (
        <div className="flex-shrink-0 mt-2">
          <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
      )}
    </Link>
  );
}
