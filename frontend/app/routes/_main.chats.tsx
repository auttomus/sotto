import * as React from "react";
import { Loader2, MessageSquare } from "lucide-react";
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Column (Daftar Chat) */}
      <div className="w-full md:w-[350px] lg:w-[380px] h-full flex-shrink-0 flex flex-col border-r border-border bg-background overflow-hidden">
        <ChatList chats={chats} user={user} />
      </div>

      {/* Right Column (Placeholder Kosong Desktop) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-card/30">
        <div className="max-w-sm space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-sm">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Mari Berkirim Pesan</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pilih salah satu percakapan di sebelah kiri untuk mulai bertukar pesan secara instan dan interaktif.
          </p>
        </div>
      </div>
    </div>
  );
}
