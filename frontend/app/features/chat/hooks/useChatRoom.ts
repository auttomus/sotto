import * as React from "react";
import { useLocation } from "react-router";
import { useGetMessagesQuery, useGetConversationsQuery, useGetOffersForConversationQuery, useUpdateMessageMutation, useDeleteMessageMutation } from "~/core/apollo/generated";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useChatSocket } from "~/core/hooks/useChatSocket";
import { useUpload } from "~/core/hooks/useUpload";

interface UseChatRoomOptions {
  conversationId: string;
}

export function useChatRoom({ conversationId }: UseChatRoomOptions) {
  const location = useLocation();
  const incomingMention = location.state?.mentionListing;

  const { user } = useAuthStore();
  const { uploadFile } = useUpload();
  const [inputText, setInputText] = React.useState("");
  const [localMessages, setLocalMessages] = React.useState<any[]>([]);
  const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
  const [selectedListing, setSelectedListing] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (incomingMention) {
      setSelectedListing(incomingMention);
      // Clear browser history state to avoid duplication on page reload
      window.history.replaceState({}, document.title);
    }
  }, [incomingMention]);

  const [isUploading, setIsUploading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { data, loading, error } = useGetMessagesQuery({
    variables: { conversationId, limit: 50 },
    skip: !conversationId,
    fetchPolicy: "cache-and-network"
  });

  const { data: offersData, refetch: refetchOffers } = useGetOffersForConversationQuery({
    variables: { conversationId },
    skip: !conversationId,
    fetchPolicy: "cache-and-network"
  });

  const { data: convData } = useGetConversationsQuery({
    fetchPolicy: "cache-first"
  });

  const conversation = convData?.conversations?.find((c: any) => c.id === conversationId);
  const recipient = conversation?.participants?.find((p: any) => p.accountId !== user?.accountId);

  const [updateMessageMutation] = useUpdateMessageMutation({
    refetchQueries: ["GetMessages", "GetConversations"]
  });

  const [deleteMessageMutation] = useDeleteMessageMutation({
    refetchQueries: ["GetMessages", "GetConversations"]
  });

  const editMessage = async (messageId: string, newContent: string) => {
    try {
      await updateMessageMutation({
        variables: {
          conversationId,
          messageId,
          input: { content: newContent }
        }
      });
    } catch (err) {
      console.error("Gagal mengubah pesan:", err);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteMessageMutation({
        variables: {
          conversationId,
          messageId
        }
      });
    } catch (err) {
      console.error("Gagal menghapus pesan:", err);
    }
  };

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
    const chatMsgs = [...serverMessages].reverse().concat(localMessages);
    const offers = offersData?.offersForConversation || [];

    // Map each Custom Offer to a pseudo-message object
    const offerMsgs = offers.map((offer: any) => ({
      messageId: `offer-${offer.id}`,
      senderId: offer.sellerAccountId,
      content: `[CUSTOM_OFFER]${JSON.stringify(offer)}`,
      createdAt: offer.createdAt,
      isCustomOffer: true,
      offerData: offer,
    }));

    // Combine and sort by createdAt ascending
    return [...chatMsgs, ...offerMsgs].sort((a: any, b: any) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [data, localMessages, offersData]);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const handleSend = async () => {
    if (!inputText.trim() && selectedImages.length === 0 && !selectedListing) return;
    
    let content = inputText.trim();
    if (selectedListing) {
      const spacing = content.length > 0 ? "\n" : "";
      content = `${content}${spacing}/listing/${selectedListing.id}`;
    }

    setIsUploading(true);

    try {
      const mediaIds: string[] = [];
      const mediaListForOptimistic: any[] = [];

      for (const file of selectedImages) {
        const result = await uploadFile(file, 'ScyllaMessage');
        mediaIds.push(result.id);
        mediaListForOptimistic.push({
          id: result.id,
          fileName: result.fileName,
          contentType: result.contentType,
          objectKey: result.objectKey,
          url: result.url,
        });
      }

      // Optimistic UI update
      const newMsg = {
        messageId: `local-${Date.now()}`,
        senderId: user?.accountId,
        content,
        createdAt: new Date().toISOString(),
        media: mediaListForOptimistic
      };

      setLocalMessages((prev) => [...prev, newMsg]);
      setInputText("");
      setSelectedImages([]);
      setSelectedListing(null);

      // Send via WebSocket
      socketSendMessage(content, mediaIds);
      sendTyping(false);
    } catch (err) {
      console.error("Gagal mengirim pesan / gambar", err);
    } finally {
      setIsUploading(false);
    }
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

  const selectListing = (listing: any) => {
    setSelectedListing(listing);
  };

  const cancelListing = () => {
    setSelectedListing(null);
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
    selectedImages,
    setSelectedImages,
    selectedListing,
    setSelectedListing,
    isUploading,
    selectListing,
    cancelListing,
    handleSend,
    handleKeyDown,
    handleInputChange,
    refetchOffers,
    editMessage,
    deleteMessage,
  };
}
