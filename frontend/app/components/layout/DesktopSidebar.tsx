import * as React from "react";
import { Home, Search, MessageSquare, ClipboardList, User, Moon, Sun, PlusSquare, Menu } from "lucide-react";
import { NavLink, Link } from "react-router";
import { cn } from "../../core/utils/cn";

export default function DesktopSidebar({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const navItems = [
    { icon: Home, label: "Beranda", to: "/" },
    { icon: Search, label: "Eksplor", to: "/explore" },
    { icon: MessageSquare, label: "Pesan", to: "/chats", hasBadge: true },
    { icon: ClipboardList, label: "Order", to: "/orders" },
    { icon: User, label: "Profil", to: "/profile" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-8 z-50">
      <Link to="/" className="flex items-center gap-2 mb-10 px-2">
        <span className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-serif italic">
          Sotto
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative",
                isActive 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon 
                    className={cn("h-6 w-6 transition-transform group-hover:scale-110", isActive && "scale-110")} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  {item.hasBadge && (
                    <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
                  )}
                </div>
                <span className="text-base">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Create Button */}
        <NavLink
          to="/workspace/create"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative mt-4",
              isActive 
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            )
          }
        >
          {({ isActive }) => (
            <>
              <PlusSquare 
                className={cn("h-6 w-6 transition-transform group-hover:scale-110", isActive && "scale-110")} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className="text-base">Buat Baru</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium group"
        >
          {isDark ? (
            <Sun className="h-6 w-6 transition-transform group-hover:scale-110" strokeWidth={2} />
          ) : (
            <Moon className="h-6 w-6 transition-transform group-hover:scale-110" strokeWidth={2} />
          )}
          <span className="text-base">{isDark ? "Mode Terang" : "Mode Gelap"}</span>
        </button>

        <button className="w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 font-medium group">
          <Menu className="h-6 w-6 transition-transform group-hover:scale-110" strokeWidth={2} />
          <span className="text-base">Lainnya</span>
        </button>
      </div>
    </aside>
  );
}
