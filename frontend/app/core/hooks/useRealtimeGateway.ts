import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useApolloClient } from '@apollo/client/react';
import { useAuthStore } from '~/core/store/useAuthStore';
import { useToastStore } from '~/core/store/useToastStore';

const isDockerOrProd =
  typeof window !== 'undefined' &&
  (window.location.port === '8080' || !window.location.port);
const WS_URL = isDockerOrProd
  ? window.location.origin
  : import.meta.env.VITE_WS_URL || 'http://localhost:3000';

/**
 * Hook global untuk koneksi real-time ke namespace /notifications.
 * Menangani:
 * 1. `newNotification` → refetch unread count + tampilkan toast
 * 2. `conversationUpdated` → refetch daftar chat
 * 3. `orderUpdated` → refetch daftar order & detail order
 *
 * Dipasang sekali di root layout agar aktif di seluruh aplikasi.
 */
export function useRealtimeGateway() {
  const token = useAuthStore((s) => s.token);
  const client = useApolloClient();
  const addToast = useToastStore((s) => s.addToast);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(`${WS_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    // ── 1. Notifikasi Baru ──────────────────────────────────
    socket.on(
      'newNotification',
      (notif: {
        type: string;
        fromDisplayName?: string | null;
        targetType?: string | null;
      }) => {
        // Refetch unread count secara global
        client.refetchQueries({ include: ['GetUnreadNotificationCount'] });

        // Tampilkan toast singkat
        const name = notif.fromDisplayName || 'Seseorang';
        let message = `${name} mengirimkan notifikasi`;

        switch (notif.type) {
          case 'FOLLOW':
            message = `${name} mulai mengikuti Anda`;
            break;
          case 'ORDER_UPDATE':
            if (notif.targetType === 'CustomOffer_Created') {
              message = `${name} mengirimkan penawaran khusus`;
            } else if (notif.targetType === 'CustomOffer_Accepted') {
              message = `${name} menyetujui penawaran khusus Anda`;
            } else if (notif.targetType === 'CustomOffer_Rejected') {
              message = `${name} menolak penawaran khusus Anda`;
            } else if (notif.targetType === 'CustomOffer_Withdrawn') {
              message = `${name} menarik penawaran khusus`;
            } else {
              message = `${name} memperbarui pesanan`;
            }
            break;
          case 'NEW_MESSAGE':
            message = `${name} mengirim pesan baru`;
            break;
          case 'MENTION':
            message = `${name} membalas postingan Anda`;
            break;
        }

        addToast('info', message);
      },
    );

    // ── 2. Pembaruan Daftar Chat ────────────────────────────
    socket.on('conversationUpdated', () => {
      client.refetchQueries({
        include: [
          'GetConversations',
          'GetUnreadChatCount',
          'GetOffersForConversation',
        ]
      });
    });

    // ── 3. Pembaruan Status Order ───────────────────────────
    socket.on('orderUpdated', () => {
      client.refetchQueries({
        include: ['GetMyOrders', 'GetOrderDetail'],
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, client, addToast]);
}
