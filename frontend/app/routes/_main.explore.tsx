import { Search, Filter, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/Badge";

const CATEGORIES = ["Semua", "UI/UX Design", "Web Dev", "Mobile App", "Logo", "Ilustrasi", "Copywriting"];
const TRENDING_TAGS = ["#ReactJS", "#Figma", "#TailwindCSS", "#NodeJS", "#NextJS"];

export default function ExploreRoute() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Search Header (Secondary because TopHeader already has one, but Explore needs a focused one) */}
      <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Eksplorasi</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all shadow-sm"
              placeholder="Cari talenta, jasa, atau karya..."
            />
          </div>
          <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Categories Scroll */}
      <div className="bg-white dark:bg-gray-900 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-2 pb-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === category
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Topik Sedang Tren</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Recommended Talents Grid */}
      <div className="px-4 mt-2">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Talenta Tersorot</h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center hover:shadow-md transition cursor-pointer">
              <div className="h-16 w-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Siswa {i}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">UI/UX Designer</p>
              <div className="mt-3 w-full">
                <button className="w-full py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
                  Lihat Profil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
