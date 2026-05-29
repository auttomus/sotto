import {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from '~/core/apollo/generated';

/**
 * Hook untuk mengelola data notifikasi.
 * Menyediakan: list notifikasi, unread count, mark as read, mark all read.
 */
export function useNotifications(take = 20) {
  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useGetNotificationsQuery({
    variables: { take },
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: unreadData,
    refetch: refetchUnread,
  } = useGetUnreadNotificationCountQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [markAsReadMutation] = useMarkNotificationAsReadMutation();
  const [markAllAsReadMutation] = useMarkAllNotificationsAsReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = unreadData?.unreadNotificationCount ?? 0;

  // Pagination: ambil 1 ekstra dari backend untuk cek hasMore
  const hasMore = notifications.length > take;
  const displayedNotifications = hasMore
    ? notifications.slice(0, take)
    : notifications;

  const loadMore = async () => {
    if (!hasMore || notifications.length === 0) return;
    const lastNotif = notifications[notifications.length - 1];
    await fetchMore({
      variables: { cursor: lastNotif.id, take },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          notifications: [
            ...prev.notifications,
            ...fetchMoreResult.notifications,
          ],
        };
      },
    });
  };

  const markAsRead = async (id: string) => {
    await markAsReadMutation({ variables: { id } });
    await refetch();
    await refetchUnread();
  };

  const markAllAsRead = async () => {
    await markAllAsReadMutation();
    await refetch();
    await refetchUnread();
  };

  return {
    notifications: displayedNotifications,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    refetch,
  };
}
