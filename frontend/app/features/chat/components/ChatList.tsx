import * as React from "react";
import { Link } from "react-router";
import { Avatar } from "~/components/ui/Avatar";
import { 
  Search,
  Image as ImageIcon,
  Video as VideoIcon,
  Paperclip,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Briefcase
} from "lucide-react";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { formatDate } from "~/core/utils/formatDate";
import { PageHeader } from "~/components/layout/PageHeader";

interface ChatListProps {
  chats: any[];
  user: any;
  activeConversationId?: string;
}

export function ChatList({ chats, user, activeConversationId }: ChatListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredChats = React.useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const otherParticipant = chat.participants?.find((p: any) => p.accountId !== user?.accountId) || chat.participants?.[0];
      const displayName = otherParticipant?.displayName || "";
      let lastMessage = chat.lastMessageContent || "";
      
      // Parse tags for searchable terms
      if (lastMessage === "[sotto:image]") lastMessage = "foto gambar image pic";
      else if (lastMessage === "[sotto:video]") lastMessage = "video rekaman clip";
      else if (lastMessage === "[sotto:file]") lastMessage = "lampiran file dokumen pdf zip doc";
      else if (lastMessage.startsWith("[SYSTEM_ORDER_")) {
        lastMessage = lastMessage.replace(/^\[SYSTEM_ORDER_[A-Z_]+\]\s*/, "");
      }

      return (
        displayName.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query)
      );
    });
  }, [chats, searchQuery, user]);

  // Helper to render media and system message previews cleanly with high fidelity icons
  const renderLastMessage = (content: string | null, activeOrder: any) => {
    if (!content) {
      return (
        <span className="text-muted-foreground text-xs italic">
          {activeOrder ? "Order Aktif" : "Buka pesan"}
        </span>
      );
    }

    // 1. Media Attachment Tag Checks
    if (content === "[sotto:image]") {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>Foto</span>
        </span>
      );
    }
    if (content === "[sotto:video]") {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <VideoIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>Video</span>
        </span>
      );
    }
    if (content === "[sotto:file]") {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>Lampiran</span>
        </span>
      );
    }

    // 2. System Message Check
    if (content.startsWith("[SYSTEM_ORDER_")) {
      const matchType = content.match(/^\[SYSTEM_ORDER_([A-Z_]+)\]/);
      const statusType = matchType ? matchType[1] : null;
      const textContent = content.replace(/^\[SYSTEM_ORDER_[A-Z_]+\]\s*/, "");

      let icon = <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
      let colorClass = "text-muted-foreground";

      if (statusType === "IN_PROGRESS" || statusType === "CREATED") {
        icon = <Clock className="h-3.5 w-3.5 text-primary shrink-0" />;
        colorClass = "text-primary font-medium";
      } else if (statusType === "DELIVERED") {
        icon = <Briefcase className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
        colorClass = "text-amber-600 dark:text-amber-500 font-medium";
      } else if (statusType === "DISPUTED") {
        icon = <ShieldAlert className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
        colorClass = "text-rose-600 dark:text-rose-500 font-medium";
      } else if (statusType === "COMPLETED") {
        icon = <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
        colorClass = "text-emerald-600 dark:text-emerald-500 font-medium";
      } else if (statusType === "CANCELLED") {
        icon = <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />;
        colorClass = "text-rose-600 dark:text-rose-500 font-medium";
      }

      return (
        <span className={`flex items-center gap-1.5 text-[11px] font-semibold leading-none truncate ${colorClass}`}>
          {icon}
          <span className="truncate">{textContent}</span>
        </span>
      );
    }

    // 3. Regular Chat message
    return <span className="truncate text-xs font-medium text-muted-foreground">{content}</span>;
  };

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
              
              const isActiveChat = chat.id === activeConversationId;
              
              return (
                <Link 
                  key={chat.id} 
                  to={`/workspace/chat/${chat.id}`} 
                  className={`flex items-center gap-3 p-3 rounded-sm transition cursor-pointer group border ${
                    isActiveChat
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20 text-primary font-bold shadow-sm"
                      : `border-transparent hover:bg-primary/5 hover:border-primary/30 ${
                          hasUnread ? "bg-primary/5 font-semibold" : ""
                        }`
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
                      <div className={`text-sm truncate flex-1 min-w-0 flex items-center ${hasUnread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {renderLastMessage(chat.lastMessageContent, chat.activeOrder)}
                      </div>
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
