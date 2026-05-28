import { Home, Search, MessageSquare, ClipboardList, User, Moon, Sun, PlusSquare, Menu } from "lucide-react";
import { NavLink, Link } from "react-router";
import { cn } from "../../core/utils/cn";
import { useThemeStore } from "~/core/store/useThemeStore";

export default function DesktopSidebar() {
  const { isDark, toggleTheme } = useThemeStore();
  const navItems = [
    { icon: Home, label: "Beranda", to: "/home" },
    { icon: Search, label: "Eksplor", to: "/explore" },
    { icon: MessageSquare, label: "Pesan", to: "/chats", hasBadge: true },
    { icon: ClipboardList, label: "Order", to: "/orders" },
    { icon: User, label: "Profil", to: "/profile" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-border bg-card px-4 py-8 z-40">
      <Link to="/home" className="flex items-center gap-2 mb-10 px-2">
        <span className="text-2xl font-bold tracking-tight text-primary font-serif italic">
          Sotto
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/profile"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-3 py-3 rounded-sm transition-all group relative",
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
                    <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
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
              "flex items-center gap-4 px-3 py-3 rounded-sm transition-all group relative mt-4",
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
              <span className="text-base">Buat Baru</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto pt-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-3 py-3 rounded-sm transition-all group relative",
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
              <span className="text-base">Lainnya</span>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
