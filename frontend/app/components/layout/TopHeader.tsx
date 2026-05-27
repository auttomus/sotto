import * as React from "react";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { Link } from "react-router";
import { useThemeStore } from "~/core/store/useThemeStore";

export default function TopHeader() {
  const { isDark, toggleTheme } = useThemeStore();
  const [isHidden, setIsHidden] = React.useState(false);

  React.useEffect(() => {
    const handleScrollHeader = (e: Event) => {
      const customEvent = e as CustomEvent<{ isHidden: boolean }>;
      setIsHidden(customEvent.detail.isHidden);
    };

    window.addEventListener("scroll-header", handleScrollHeader);
    return () => window.removeEventListener("scroll-header", handleScrollHeader);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border transition-transform duration-300 ${isHidden ? "max-md:-translate-y-full" : "translate-y-0"}`}>
      <div className="flex items-center justify-between px-4 h-16 w-full max-w-lg mx-auto md:max-w-none md:px-6">
        <Link to="/home" className="text-xl font-bold tracking-tight text-primary font-serif italic">
          Sotto
        </Link>
        <div className="flex items-center gap-3 ml-4">
          <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-2 block h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
          </button>
        </div>
      </div>
    </header>
  );
}

