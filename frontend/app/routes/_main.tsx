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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 transition-all w-full">
        <div className="md:hidden">
          <TopHeader />
        </div>

        <main className="flex-1 w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-sm min-h-screen border-x border-gray-100 dark:border-gray-800 relative pb-16 md:pb-0">
          <Outlet />
        </main>

        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
