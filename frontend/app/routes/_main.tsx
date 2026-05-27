import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import TopHeader from "../components/layout/TopHeader";
import BottomNav from "../components/layout/BottomNav";
import DesktopSidebar from "../components/layout/DesktopSidebar";
import { useThemeStore } from "~/core/store/useThemeStore";
import { useAuthStore } from "~/core/store/useAuthStore";
import { ROUTES } from "~/core/constants/ROUTES";
export default function MainLayout() {
  const initTheme = useThemeStore((s) => s.initTheme);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initTheme();
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [initTheme, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <div className="max-w-[960px] mx-auto flex w-full relative min-h-screen">
        <DesktopSidebar />

        <div className="flex-1 flex flex-col transition-all w-full min-w-0">

          <main className="flex-1 w-full bg-card shadow-sm min-h-screen border-x border-border md:border-l-0 relative pb-16 md:pb-0 transition-colors duration-300">
            <Outlet />
          </main>

          <div className="md:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}
