import * as React from "react";
import { Link } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { Search } from "lucide-react";

export default function ChatsListRoute() {
  const chats = [
    {
      id: "1",
      name: "Kadek Agus",
      avatar: "https://i.pravatar.cc/150?u=kadek",
      lastMessage: "Iya Bli, saya butuh web landing page sederhana...",
      time: "09:45",
      unread: 0,
      online: true,
    },
    {
      id: "2",
      name: "Budi Santoso",
      avatar: "https://i.pravatar.cc/150?u=budi",
      lastMessage: "Terima kasih atas orderannya, file sudah saya kirim.",
      time: "Kemarin",
      unread: 2,
      online: false,
    },
    {
      id: "3",
      name: "Siti Aminah",
      avatar: "https://i.pravatar.cc/150?u=siti",
      lastMessage: "Kira-kira harganya bisa kurang lagi nggak ya?",
      time: "Senin",
      unread: 0,
      online: true,
    }
  ];

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
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="Cari pesan..."
          />
        </div>

        <div className="space-y-1">
          {chats.map((chat) => (
            <Link 
              key={chat.id} 
              to="/workspace/chat" 
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer group"
            >
              <div className="relative">
                <Avatar src={chat.avatar} size="md" />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <p className={`text-sm truncate ${chat.unread > 0 ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="shrink-0 h-5 w-5 bg-indigo-600 text-white flex items-center justify-center rounded-full text-[10px] font-bold">
                  {chat.unread}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
