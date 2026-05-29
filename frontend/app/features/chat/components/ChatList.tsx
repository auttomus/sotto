import * as React from "react";
import { Link } from "react-router";
import { Avatar } from "~/components/ui/Avatar";
import { Search } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { formatDate } from "~/core/utils/formatDate";
import { PageHeader } from "~/components/layout/PageHeader";

interface ChatListProps {
  chats: any[];
  user: any;
}

export function ChatList({ chats, user }: ChatListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredChats = React.useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const otherParticipant = chat.participants?.find((p: any) => p.accountId !== user?.accountId) || chat.participants?.[0];
      const displayName = otherParticipant?.displayName || "";
      const lastMessage = chat.lastMessageContent || "";
      return (
        displayName.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query)
      );
    });
  }, [chats, searchQuery, user]);

  return (
    <div className="flex flex-col h-full bg-background w-full relative">
      <PageHeader
        title="Pesan"
        tabs={
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input w-full pl-10 pr-3 py-2.5 sm:text-sm"
                placeholder="Cari pesan..."
              />
            </div>
          </div>
        }
      />
      
      <div className="p-4 pt-2">

        <div className="space-y-1">
          {filteredChats.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              {searchQuery ? "Pesan tidak ditemukan." : "Belum ada pesan."}
            </div>
          ) : (
            filteredChats.map((chat: any) => {
              const otherParticipant = chat.participants?.find((p: any) => p.accountId !== user?.accountId) || chat.participants?.[0];
              const displayName = otherParticipant?.displayName || 'User';
              const avatar = resolveMediaUrl(otherParticipant?.avatarObjectKey);
              const hasUnread = chat.unreadCount > 0;
              
              return (
                <Link 
                  key={chat.id} 
                  to={`/workspace/chat/${chat.id}`} 
                  className={`flex items-center gap-3 p-3 rounded-sm hover:bg-muted transition cursor-pointer group ${
                    hasUnread ? "bg-primary/5 font-semibold" : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar src={avatar} size="md" alt={displayName} />
                    {hasUnread && (
                      <span className="absolute -top-0.5 -right-0.5 block h-3 w-3 rounded-full bg-primary ring-2 ring-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm truncate ${hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground"}`}>{displayName}</h3>
                      <span className={`text-xs whitespace-nowrap ml-2 ${hasUnread ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                        {formatDate((chat.lastMessageAt || chat.updatedAt) as string)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate flex-1 ${hasUnread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {chat.lastMessageContent || (chat.activeOrder ? "Order Aktif" : "Buka pesan")}
                      </p>
                      {hasUnread && (
                        <span className="flex-shrink-0 text-[10px] font-bold bg-primary text-primary-foreground h-4 px-1.5 rounded-full flex items-center justify-center min-w-4">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
