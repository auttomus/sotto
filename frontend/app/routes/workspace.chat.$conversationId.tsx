import * as React from "react";
import { ArrowLeft, MoreVertical, Paperclip, Send, Check, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { resolveMediaUrl } from "~/core/utils/resolveMediaUrl";
import { useChatRoom } from "~/features/chat/hooks/useChatRoom";

export default function ChatRoute() {
  const { conversationId } = useParams();
  
  const {
    inputText,
    messagesEndRef,
    allMessages,
    loading,
    recipient,
    user,
    handleSend,
    handleKeyDown,
    handleInputChange,
  } = useChatRoom({ conversationId: conversationId as string });

  if (loading && !allMessages.length) {
    return (
      <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50 dark:bg-gray-950 w-full max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 relative">
      {/* Header */}
      <header className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 px-3 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/chats" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Avatar src={recipient ? resolveMediaUrl(recipient.avatarObjectKey) : ""} size="sm" alt={recipient?.displayName || "User"} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-none">{recipient?.displayName || 'Percakapan'}</span>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className="text-[10px] font-medium bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full">
            Hari ini
          </span>
        </div>

        {allMessages.map((msg: any) => {
          const isMine = msg.senderId === user?.accountId;
          
          return (
            <div key={msg.messageId} className={`flex gap-2 max-w-[85%] ${isMine ? 'self-end' : ''}`}>
              {!isMine && (
                <Avatar src="" size="sm" className="mt-auto shrink-0 h-6 w-6" />
              )}
              <div className={`${isMine ? 'bg-indigo-600 rounded-br-sm' : 'bg-white dark:bg-gray-800 rounded-bl-sm border border-gray-100 dark:border-gray-700/50'} p-3 rounded-2xl shadow-sm`}>
                <p className={`text-sm ${isMine ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  {msg.content}
                </p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${!isMine ? 'text-right' : ''}`}>
                  <span className={`text-[10px] ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMine && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-3 pb-safe">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full pr-1.5 pl-3 py-1.5">
          <button className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition shrink-0">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 outline-none"
            placeholder="Ketik pesan..."
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shrink-0 shadow-sm disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
