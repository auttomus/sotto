import * as React from "react";
import { ArrowLeft, MoreVertical, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { useChatRoom } from "~/features/chat/hooks/useChatRoom";

// Modular Components
import { MessageBubble } from "~/features/chat/components/MessageBubble";
import { ChatInputArea } from "~/features/chat/components/ChatInputArea";
import { ListingSelectionModal } from "~/features/chat/components/ListingSelectionModal";
import { CreateOfferModal } from "~/features/chat/components/CreateOfferModal";

export default function ChatRoute() {
  const { conversationId } = useParams();
  
  const {
    inputText,
    messagesEndRef,
    allMessages,
    loading,
    recipient,
    user,
    selectedImages,
    setSelectedImages,
    selectedListing,
    isUploading,
    selectListing,
    cancelListing,
    handleSend,
    handleKeyDown,
    handleInputChange,
    refetchOffers,
    editMessage,
    deleteMessage,
  } = useChatRoom({ conversationId: conversationId as string });

  const [isListingModalOpen, setIsListingModalOpen] = React.useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = React.useState(false);

  if (loading && !allMessages.length) {
    return (
      <div className="flex flex-col h-[100dvh] bg-background w-full max-w-lg mx-auto border-x border-border justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background w-full max-w-lg mx-auto border-x border-border relative text-foreground">
      {/* Header */}
      <header className="shrink-0 bg-card border-b border-border sticky top-0 z-10 px-3 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/chats" className="p-2 -ml-2 rounded-full hover:bg-muted transition">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Avatar src={recipient ? resolveMediaUrl(recipient.avatarObjectKey) : ""} size="sm" alt={recipient?.displayName || "User"} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground text-sm leading-none">{recipient?.displayName || 'Percakapan'}</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-muted transition">
          <MoreVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className="text-[10px] font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full">
            Hari ini
          </span>
        </div>

        {allMessages.map((msg: any) => (
          <MessageBubble 
            key={msg.messageId} 
            msg={msg} 
            userAccountId={user?.accountId} 
            recipientAvatar={recipient?.avatarObjectKey} 
            refetchOffers={refetchOffers}
            onEdit={editMessage}
            onDelete={deleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInputArea 
        inputText={inputText}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        handleSend={handleSend}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        selectedListing={selectedListing}
        onCancelListing={cancelListing}
        isUploading={isUploading}
        onOpenListingModal={() => setIsListingModalOpen(true)}
        onOpenOfferModal={() => setIsOfferModalOpen(true)}
      />

      {/* Mention Listing sliding / overlay Modal */}
      <ListingSelectionModal 
        isOpen={isListingModalOpen}
        onClose={() => setIsListingModalOpen(false)}
        onSelect={selectListing}
        userAccountId={user?.accountId}
        recipientAccountId={recipient?.accountId}
        recipientDisplayName={recipient?.displayName}
      />

      {/* Custom Offer Modal */}
      <CreateOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        conversationId={conversationId as string}
        buyerAccountId={recipient?.accountId || ""}
        listingId={selectedListing?.id}
        onSuccess={refetchOffers}
      />
    </div>
  );
}
