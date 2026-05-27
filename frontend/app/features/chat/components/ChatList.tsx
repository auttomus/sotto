import * as React from "react";
import { Link } from "react-router";
import { Avatar } from "~/components/ui/Avatar";
import { Search } from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { formatDate } from "~/core/utils/formatDate";

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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 w-full relative">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 hidden md:block">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pesan</h1>
      </div>
      
      <div className="p-4">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Cari pesan..."
          />
        </div>

        <div className="space-y-1">
          {filteredChats.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              {searchQuery ? "Pesan tidak ditemukan." : "Belum ada pesan."}
            </div>
          ) : (
            filteredChats.map((chat: any) => {
              const otherParticipant = chat.participants?.find((p: any) => p.accountId !== user?.accountId) || chat.participants?.[0];
              const displayName = otherParticipant?.displayName || 'User';
              const avatar = resolveMediaUrl(otherParticipant?.avatarObjectKey);
              
              return (
                <Link 
                  key={chat.id} 
                  to={`/workspace/chat/${chat.id}`} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer group"
                >
                  <div className="relative">
                    <Avatar src={avatar} size="md" alt={displayName} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{displayName}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                        {formatDate((chat.lastMessageAt || chat.updatedAt) as string)}
                      </span>
                    </div>
                    <p className="text-sm truncate text-gray-500 dark:text-gray-400">
                      {chat.lastMessageContent || (chat.activeOrder ? "Order Aktif" : "Buka pesan")}
                    </p>
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
