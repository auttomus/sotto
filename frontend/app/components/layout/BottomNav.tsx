import * as React from "react";
import { Home, Search, MessageSquare, ClipboardList, User } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "../../core/utils/cn";

export default function BottomNav() {
  const navItems = [
    { icon: Home, label: "Beranda", to: "/" },
    { icon: Search, label: "Eksplor", to: "/explore" },
    { icon: MessageSquare, label: "Pesan", to: "/workspace/chat", hasBadge: true },
    { icon: ClipboardList, label: "Order", to: "/workspace/order" },
    { icon: User, label: "Profil", to: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 relative group transition-colors",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                  {item.hasBadge && (
                    <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                  )}
                </div>
                <span className={cn("text-[10px] font-medium transition-all", isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
