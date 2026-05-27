import * as React from "react";
import { Loader2 } from "lucide-react";
import { useConversations } from "~/features/chat/hooks/useConversations";
import { ChatList } from "~/features/chat/components/ChatList";

export default function ChatsListRoute() {
  const { chats, loading, error, user } = useConversations();

  if (loading && !chats.length) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Gagal memuat pesan.
      </div>
    );
  }

  return <ChatList chats={chats} user={user} />;
}
