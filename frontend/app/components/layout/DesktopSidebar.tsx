import { Home, Search, MessageSquare, ClipboardList, User, PlusSquare, Menu, Bell } from "lucide-react";
import { NavLink, Link } from "react-router";
import { cn } from "../../core/utils/cn";
import { useLayoutStore } from "~/core/store/useLayoutStore";
import { useGetUnreadNotificationCountQuery, useGetUnreadChatCountQuery } from "~/core/apollo/generated";

export default function DesktopSidebar() {
  const isSidebarCollapsed = useLayoutStore((s) => s.isSidebarCollapsed);

  const { data } = useGetUnreadNotificationCountQuery({
    fetchPolicy: "cache-and-network",
  });
  const unreadCount = data?.unreadNotificationCount ?? 0;

  const { data: chatUnreadData } = useGetUnreadChatCountQuery({
    fetchPolicy: "cache-and-network",
  });
  const unreadChatCount = chatUnreadData?.unreadChatCount ?? 0;

  const navItems = [
    { icon: Home, label: "Beranda", to: "/home" },
    { icon: Search, label: "Eksplor", to: "/explore" },
    { icon: Bell, label: "Notifikasi", to: "/notifications", hasBadge: unreadCount > 0 },
    { icon: MessageSquare, label: "Pesan", to: "/chats", hasBadge: unreadChatCount > 0 },
    { icon: ClipboardList, label: "Order", to: "/orders" },
    { icon: User, label: "Profil", to: "/profile" },
  ];

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen sticky top-0 border-r border-border bg-card py-8 z-40 transition-all duration-300 shrink-0",
      isSidebarCollapsed ? "w-20 px-2 items-center" : "w-64 lg:w-72 px-4"
    )}>
      <Link to="/home" className={cn("flex items-center gap-2 mb-10", isSidebarCollapsed ? "justify-center w-full" : "px-2")}>
        <span className="text-2xl font-bold tracking-tight text-primary font-serif italic">
          {isSidebarCollapsed ? "S" : "Sotto"}
        </span>
      </Link>

      <nav className={cn("flex-1 space-y-2", isSidebarCollapsed ? "w-full flex flex-col items-center" : "")}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/profile"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-3 py-3 rounded-sm transition-all group relative",
                isSidebarCollapsed 
                  ? "justify-center px-0 w-12 h-12 rounded-full hover:bg-accent/80" 
                  : "w-full",
                isActive 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium"
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
                    <span className={cn(
                      "absolute block rounded-full bg-destructive ring-2 ring-card",
                      isSidebarCollapsed ? "h-2 w-2 -top-0.5 -right-0.5" : "h-2.5 w-2.5 -top-1 -right-1"
                    )} />
                  )}
                </div>
                {!isSidebarCollapsed && <span className="text-base">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Create Button */}
        <NavLink
          to="/workspace/create"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-3 rounded-sm transition-all group relative mt-4",
              isSidebarCollapsed 
                ? "justify-center px-0 w-12 h-12 rounded-full hover:bg-accent/80" 
                : "w-full",
              isActive 
                ? "bg-primary/10 text-primary font-bold" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium"
            )
          }
        >
          {({ isActive }) => (
            <>
              <PlusSquare 
                className={cn("h-6 w-6 transition-transform group-hover:scale-110", isActive && "scale-110")} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              {!isSidebarCollapsed && <span className="text-base">Buat Baru</span>}
            </>
          )}
        </NavLink>
      </nav>

      <div className={cn("mt-auto pt-4", isSidebarCollapsed ? "w-full flex justify-center" : "")}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-3 rounded-sm transition-all group relative",
              isSidebarCollapsed 
                ? "justify-center px-0 w-12 h-12 rounded-full hover:bg-accent/80" 
                : "w-full",
              isActive 
                ? "bg-primary/10 text-primary font-bold" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Menu 
                className={cn("h-6 w-6 transition-transform group-hover:scale-110", isActive && "scale-110")} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              {!isSidebarCollapsed && <span className="text-base">Lainnya</span>}
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
