import * as React from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "../hooks/useNotifications";
import { PageHeader } from "~/components/layout/PageHeader";

export function NotificationList() {
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="pb-20 min-h-screen">
      <PageHeader
        title="Notifikasi"
        rightAction={
          unreadCount > 0 ? (
            <button
              onClick={markAllAsRead}
              className="p-2 -mr-1 rounded-full hover:bg-muted transition cursor-pointer text-primary"
              aria-label="Tandai semua telah dibaca"
            >
              <CheckCheck className="h-5 w-5" />
            </button>
          ) : undefined
        }
      />

      {/* Daftar Notifikasi */}
      <div className="flex flex-col">
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
            <Bell className="h-12 w-12 opacity-30" />
            <p className="text-sm">Belum ada notifikasi</p>
          </div>
        ) : (
          <>
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                id={notif.id}
                type={notif.type}
                targetType={notif.targetType}
                targetId={notif.targetId}
                fromDisplayName={notif.fromDisplayName}
                fromUsername={notif.fromUsername}
                fromAccountId={notif.fromAccountId}
                isRead={notif.isRead}
                createdAt={notif.createdAt}
                onMarkAsRead={markAsRead}
              />
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full py-4 text-sm text-primary hover:bg-muted/50 transition font-medium cursor-pointer"
              >
                Muat lebih banyak
              </button>
            )}

            {/* End of list */}
            {!hasMore && notifications.length > 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Semua notifikasi telah ditampilkan
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
