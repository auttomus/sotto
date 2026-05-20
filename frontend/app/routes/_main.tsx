import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import TopHeader from "../components/layout/TopHeader";
import BottomNav from "../components/layout/BottomNav";
import DesktopSidebar from "../components/layout/DesktopSidebar";

export default function MainLayout() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <DesktopSidebar toggleTheme={toggleTheme} isDark={isDark} />

      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 transition-all w-full">
        <div className="md:hidden">
          <TopHeader toggleTheme={toggleTheme} isDark={isDark} />
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
