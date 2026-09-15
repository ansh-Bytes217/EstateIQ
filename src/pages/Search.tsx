import React, { useState } from "react";
import { SearchHeader } from "../features/search/components/SearchHeader";
import { SearchFiltersBar } from "../features/search/components/SearchFiltersBar";
import { ActiveFilterChips } from "../features/search/components/ActiveFilterChips";
import { SearchResultsHeader } from "../features/search/components/SearchResultsHeader";
import { SearchResults } from "../features/search/components/SearchResults";
import { SearchPagination } from "../features/search/components/SearchPagination";
import { AdvancedFilters } from "../features/search/components/AdvancedFilters";
import { usePropertySearch } from "../features/search/hooks/usePropertySearch";
import { useSearchFilters } from "../features/search/hooks/useSearchFilters";
import { PropertyMap } from "../features/map/components/PropertyMap";
import { Map as MapIcon, List } from "lucide-react";
import { useMapStore } from "../features/map/store/useMapStore";

export const Search = () => {
  const [layout, setLayout] = useState<"grid" | "list">("list");
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  
  const { searchAsIMove, setSearchAsIMove, mapBounds } = useMapStore();
  const { filters } = useSearchFilters();

  const activeFilters = {
    ...filters,
    bounds: searchAsIMove && mapBounds ? mapBounds : undefined
  };

  const handleSearchAsIMoveToggle = (checked: boolean) => {
    setSearchAsIMove(checked);
  };

  const { data, isLoading, isError, refetch, isFetching } = usePropertySearch(activeFilters);

  React.useEffect(() => {
    if (activeFilters.city) {
      document.title = `Properties in ${activeFilters.city} | EstateIQ Search`;
    } else {
      document.title = `Search Properties | EstateIQ`;
    }
  }, [activeFilters.city]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative overflow-hidden">
      <div className="shrink-0 z-20 bg-white shadow-sm">
        <SearchHeader />
        <SearchFiltersBar onOpenAdvanced={() => setIsAdvancedFiltersOpen(true)} />
        <ActiveFilterChips />
      </div>
      
      <main className="flex-1 flex overflow-hidden relative z-0">
        {/* Left Pane - Results List */}
        <div className={`w-full lg:w-[55%] xl:w-[60%] flex flex-col h-full overflow-hidden bg-slate-50 ${mobileView === "map" ? "hidden lg:flex" : "flex"}`}>
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 scroll-smooth">
            {data && (
              <SearchResultsHeader 
                total={data.total} 
                layout={layout} 
                onLayoutChange={setLayout} 
                isMapBounded={!!activeFilters.bounds}
              />
            )}
            
            <div className="relative min-h-[400px]">
              <SearchResults 
                properties={data?.items || []} 
                isLoading={isLoading || isFetching} 
                isError={isError} 
                refetch={refetch}
                layout={layout}
              />
            </div>

            {data && (
              <SearchPagination 
                currentPage={data.page} 
                totalPages={data.totalPages} 
              />
            )}
          </div>
        </div>

        {/* Right Pane - Map */}
        <div className={`w-full lg:w-[45%] xl:w-[40%] bg-slate-200 relative border-l border-slate-200 z-0 h-full ${mobileView === "list" ? "hidden lg:block" : "block"}`}>
          <PropertyMap properties={data?.items || []} isLoading={isLoading || isFetching} />
          
          {/* Map Overlays (Search as I move) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white rounded-full shadow-md border border-slate-200 px-4 py-2 flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                checked={searchAsIMove}
                onChange={(e) => handleSearchAsIMoveToggle(e.target.checked)}
              />
              Search as I move the map
            </label>
          </div>
        </div>
        
        {/* Mobile View Toggle */}
        <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[500]">
          <button
            onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
            className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            {mobileView === "list" ? (
              <><MapIcon className="w-4 h-4" /> Map View</>
            ) : (
              <><List className="w-4 h-4" /> List View</>
            )}
          </button>
        </div>
      </main>

      <AdvancedFilters 
        isOpen={isAdvancedFiltersOpen} 
        onClose={() => setIsAdvancedFiltersOpen(false)} 
      />
    </div>
  );
};
