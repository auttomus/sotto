import * as React from "react";
import { useConversations } from "~/features/chat/hooks/useConversations";
import { ChatList } from "~/features/chat/components/ChatList";
import { Loader2 } from "lucide-react";

interface ChatSidePanelProps {
  activeConversationId?: string;
}

export function ChatSidePanel({ activeConversationId }: ChatSidePanelProps) {
  const { chats, loading, error, user } = useConversations();

  if (loading && !chats.length) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh] w-full bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-xs text-destructive w-full bg-background">
        Gagal memuat daftar pesan.
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background border-r border-border overflow-y-auto">
      <ChatList chats={chats} user={user} activeConversationId={activeConversationId} />
    </div>
  );
}
