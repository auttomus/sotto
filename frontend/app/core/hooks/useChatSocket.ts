import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '~/core/store/useAuthStore';

const isDockerOrProd = typeof window !== 'undefined' && (window.location.port === '8080' || !window.location.port);
const WS_URL = isDockerOrProd
  ? window.location.origin
  : import.meta.env.VITE_WS_URL || 'http://localhost:3000';

interface ChatMessage {
  messageId: string;
  senderId: string;
  senderDisplayName?: string;
  senderAvatarObjectKey?: string;
  content: string;
  conversationId: string;
  createdAt: string;
  media?: any[];
}

interface UseChatSocketOptions {
  conversationId: string;
  onNewMessage: (message: ChatMessage) => void;
  onUserTyping?: (data: { accountId: string; isTyping: boolean }) => void;
  onConversationRead?: (data: {
    conversationId: string;
    accountId: string;
    lastReadMessageId: string | null;
  }) => void;
}

export function useChatSocket({ conversationId, onNewMessage, onUserTyping, onConversationRead }: UseChatSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const token = useAuthStore.getState().token;

  useEffect(() => {
    if (!conversationId || !token) return;

    const socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', { conversationId });
      socket.emit('readConversation', { conversationId });
    });

    socket.on('newMessage', (message: ChatMessage) => {
      onNewMessage(message);
    });

    if (onUserTyping) {
      socket.on('userTyping', onUserTyping);
    }

    if (onConversationRead) {
      socket.on('conversationRead', onConversationRead);
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, token]);

  const sendMessage = useCallback((content: string, mediaIds?: string[], callback?: (msg: ChatMessage) => void) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit(
      'sendMessage',
      {
        conversationId,
        content,
        mediaIds,
      },
      (response: ChatMessage) => {
        if (callback) callback(response);
      }
    );
  }, [conversationId]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('typing', {
      conversationId,
      isTyping,
    });
  }, [conversationId]);

  const sendRead = useCallback(() => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('readConversation', {
      conversationId,
    });
  }, [conversationId]);

  return { sendMessage, sendTyping, sendRead };
}
