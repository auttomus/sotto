import { Search, AlertCircle } from "lucide-react";
import { SearchResults } from "~/features/explore/components/SearchResults";
import { useExplore } from "~/features/explore/hooks/useExplore";

export default function ExploreRoute() {
  const {
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
        </div>
      </div>



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
            posts={searchResults.posts}
            tags={searchResults.tags}
            searchQuery={searchQuery}
            onTagClick={(tag) => setSearchQuery(tag)}
          />
        )}
      </div>
    </div>
  );
}
