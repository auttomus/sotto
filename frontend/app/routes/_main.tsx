import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import TopHeader from "../components/layout/TopHeader";
import BottomNav from "../components/layout/BottomNav";
import DesktopSidebar from "../components/layout/DesktopSidebar";
import { useThemeStore } from "~/core/store/useThemeStore";
import { useAuthStore } from "~/core/store/useAuthStore";
import { useLayoutStore } from "~/core/store/useLayoutStore";
import { ROUTES } from "~/core/constants/ROUTES";
import { cn } from "~/core/utils/cn";

export default function MainLayout() {
  const initTheme = useThemeStore((s) => s.initTheme);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setSidebarCollapsed } = useLayoutStore();

  useEffect(() => {
    initTheme();
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [initTheme, isAuthenticated, navigate]);

  // Automate sidebar collapse and BottomNav visibility based on route
  const collapsedRoutes = ["/chats", "/workspace/chat", "/orders", "/workspace/order"];
  const hideBottomNavRoutes = ["/workspace/chat", "/workspace/order"];

  const shouldCollapseSidebar = collapsedRoutes.some(route => location.pathname.startsWith(route));
  const shouldHideBottomNav = hideBottomNavRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    setSidebarCollapsed(shouldCollapseSidebar);
  }, [location.pathname, shouldCollapseSidebar, setSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <div className={cn(
        "mx-auto flex w-full relative min-h-screen transition-all duration-300",
        isSidebarCollapsed ? "max-w-[1200px]" : "max-w-[960px]"
      )}>
        <DesktopSidebar />

        <div className="flex-1 flex flex-col transition-all w-full min-w-0">

          <main className={cn(
            "flex-1 w-full bg-card shadow-sm min-h-screen border-x border-border md:border-l-0 relative pb-16 md:pb-0 transition-colors duration-300",
            isSidebarCollapsed ? "border-r-0" : ""
          )}>
            <Outlet />
          </main>

          {!shouldHideBottomNav && (
            <div className="md:hidden">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
