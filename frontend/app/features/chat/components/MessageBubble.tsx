import * as React from "react";
import { Check } from "lucide-react";
import { Avatar } from "~/components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { ChatMessageListing } from "./ChatMessageListing";

interface MessageBubbleProps {
  msg: any;
  userAccountId?: string;
  recipientAvatar?: string | null;
}

export function MessageBubble({ msg, userAccountId, recipientAvatar }: MessageBubbleProps) {
  const isMine = msg.senderId === userAccountId;
  
  // Regex to parse UUID of mentioned listing in text
  const listingRegex = /\s*\/listing\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\s*/g;
  const match = msg.content?.match(listingRegex);
  const listingId = match ? match[0].match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)?.[0] : null;
  const cleanContent = msg.content?.replace(listingRegex, "").trim();

  return (
    <div className={`flex gap-2 max-w-[85%] ${isMine ? 'self-end' : ''}`}>
      {!isMine && (
        <Avatar 
          src={recipientAvatar ? resolveMediaUrl(recipientAvatar) : ""} 
          size="sm" 
          className="mt-auto shrink-0 h-6 w-6" 
        />
      )}
      <div className={`${isMine ? 'bg-indigo-600 rounded-br-sm' : 'bg-white dark:bg-gray-800 rounded-bl-sm border border-gray-100 dark:border-gray-700/50'} p-3 rounded-2xl shadow-sm w-full`}>
        {cleanContent && (
          <p className={`text-sm ${isMine ? 'text-white' : 'text-gray-800 dark:text-gray-200'} whitespace-pre-wrap break-words`}>
            {cleanContent}
          </p>
        )}

        {/* Display listing attachment if mentioned */}
        {listingId && <ChatMessageListing listingId={listingId} />}

        {/* Display media attachments (Images) */}
        {msg.media && msg.media.length > 0 && (
          <div className="mt-2 space-y-2">
            {msg.media.map((item: any) => {
              const url = resolveMediaUrl(item.url || item.objectKey);
              return (
                <div 
                  key={item.id} 
                  className="rounded-xl overflow-hidden max-w-full bg-gray-50 border border-gray-150 dark:border-gray-800 max-h-[220px] flex items-center justify-center cursor-zoom-in group/media"
                  onClick={() => window.open(url, '_blank')}
                >
                  <img
                    src={url || ""}
                    alt={item.fileName || "Gambar chat"}
                    className="w-full h-auto max-h-[220px] object-cover rounded-xl select-none group-hover/media:brightness-95 transition-all duration-200"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className={`flex items-center justify-end gap-1 mt-1.5 ${!isMine ? 'text-right' : ''}`}>
          <span className={`text-[9px] ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMine && <Check className="h-3 w-3 text-white" />}
        </div>
      </div>
    </div>
  );
}
