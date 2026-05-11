import { Outlet } from "react-router";
import TopHeader from "../components/layout/TopHeader.tsx";
import BottomNav from "../components/layout/BottomNav.tsx";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans pb-16">
      <TopHeader />
      <main className="flex-1 w-full max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-sm min-h-screen border-x border-gray-100 dark:border-gray-800 relative">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
