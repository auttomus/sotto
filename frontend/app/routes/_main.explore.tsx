import { Search, Filter, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { SearchResults } from "~/features/explore/components/SearchResults";
import { useExplore } from "~/features/explore/hooks/useExplore";

const CATEGORIES = ["Semua", "UI/UX Design", "Web Dev", "Mobile App", "Logo", "Ilustrasi", "Copywriting"];
const TRENDING_TAGS = ["#ReactJS", "#Figma", "#TailwindCSS", "#NodeJS", "#NextJS"];

export default function ExploreRoute() {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    isSearching,
    isLoading,
    error,
    searchResults
  } = useExplore();

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-950 min-h-screen flex flex-col">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Eksplorasi</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all shadow-sm"
              placeholder="Cari talenta, jasa, atau karya..."
            />
          </div>
          <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {!isSearching && (
        <div className="shrink-0">
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
                <Badge key={tag} variant="secondary" onClick={() => setSearchQuery(tag.replace('#', ''))} className="px-3 py-1 text-sm font-medium cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="px-4 flex-1">
        {!isSearching && <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 mt-2">Pilihan Untukmu</h2>}
        {isSearching && <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 mt-6">Hasil Pencarian</h2>}
        
        {error ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Gagal memuat data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Terjadi kesalahan saat menghubungi server. Silakan coba beberapa saat lagi.</p>
          </div>
        ) : (
          <SearchResults 
            isLoading={isLoading}
            accounts={searchResults.accounts}
            listings={searchResults.listings}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}
