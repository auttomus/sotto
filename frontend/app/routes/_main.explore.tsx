import { Search, AlertCircle } from "lucide-react";
import { SearchResults } from "~/features/explore/components/SearchResults";
import { useExplore } from "~/features/explore/hooks/useExplore";
import { PageHeader } from "~/components/layout/PageHeader";

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
    <div className="pb-20 bg-background min-h-screen flex flex-col">
      <PageHeader
        title="Eksplorasi"
        tabs={
          <div className="px-4 pb-3 flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
                placeholder="Cari talenta, jasa, atau karya..."
              />
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="px-4 flex-1">
        {!isSearching && <h2 className="text-sm font-bold text-foreground mb-3 mt-2">Pilihan Untukmu</h2>}
        {isSearching && <h2 className="text-sm font-bold text-foreground mb-3 mt-6">Hasil Pencarian</h2>}
        
        {error ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <h3 className="text-lg font-bold text-foreground">Gagal memuat data</h3>
            <p className="text-sm text-muted-foreground mt-1">Terjadi kesalahan saat menghubungi server. Silakan coba beberapa saat lagi.</p>
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
