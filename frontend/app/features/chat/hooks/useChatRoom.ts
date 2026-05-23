import * as React from "react";
import { useGetMessagesQuery, useGetConversationsQuery } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useChatSocket } from "~/core/hooks/useChatSocket";

interface UseChatRoomOptions {
  conversationId: string;
}

export function useChatRoom({ conversationId }: UseChatRoomOptions) {
  const { user } = useAuthStore();
  const [inputText, setInputText] = React.useState("");
  const [localMessages, setLocalMessages] = React.useState<any[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { data, loading, error } = useGetMessagesQuery({
    variables: { conversationId, limit: 50 },
    skip: !conversationId,
    fetchPolicy: "cache-and-network"
  });

  const { data: convData } = useGetConversationsQuery({
    fetchPolicy: "cache-first"
  });

  const conversation = convData?.conversations?.find((c: any) => c.id === conversationId);
  const recipient = conversation?.participants?.find((p: any) => p.accountId !== user?.accountId);

  // Real-time messaging via Socket.io
  const { sendMessage: socketSendMessage, sendTyping } = useChatSocket({
    conversationId,
    onNewMessage: (message) => {
      // Only add if not from us (our own messages are added optimistically)
      if (message.senderId !== user?.accountId) {
        setLocalMessages((prev) => [...prev, message]);
      }
    },
  });

  const allMessages = React.useMemo(() => {
    const serverMessages = data?.messages || [];
    return [...serverMessages].reverse().concat(localMessages);
  }, [data, localMessages]);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const content = inputText.trim();
    
    // Optimistic UI update
    const newMsg = {
      messageId: `local-${Date.now()}`,
      senderId: user?.accountId,
      content,
      createdAt: new Date().toISOString(),
      media: []
    };
    
    setLocalMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Send via WebSocket
    socketSendMessage(content);
    sendTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    sendTyping(e.target.value.length > 0);
  };

  return {
    inputText,
    setInputText,
    localMessages,
    messagesEndRef,
    allMessages,
    loading,
    error,
    recipient,
    conversation,
    user,
    handleSend,
    handleKeyDown,
    handleInputChange,
  };
}
