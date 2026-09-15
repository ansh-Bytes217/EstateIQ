import React from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { LayoutGrid, List } from "lucide-react";

interface SearchResultsHeaderProps {
  total: number;
  layout: "grid" | "list";
  onLayoutChange: (layout: "grid" | "list") => void;
  isMapBounded?: boolean;
}

export const SearchResultsHeader = ({ total, layout, onLayoutChange, isMapBounded }: SearchResultsHeaderProps) => {
  const { filters, updateFilters } = useSearchFilters();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {total} {total === 1 ? "Property" : "Properties"} {isMapBounded ? "in this area" : "Found"}
        </h1>
        {filters.city && !isMapBounded && (
          <p className="text-sm text-slate-500 mt-1">
            in {filters.city}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <select 
          value={filters.sort || "recommended"}
          onChange={(e) => updateFilters({ sort: e.target.value as any })}
          className="text-sm bg-transparent border-none text-slate-700 outline-none cursor-pointer font-semibold focus:ring-0"
        >
          <option value="recommended">Sort by: Recommended</option>
          <option value="newest">Sort by: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="area_desc">Area: Largest</option>
          <option value="area_asc">Area: Smallest</option>
        </select>

        <div className="hidden sm:flex bg-white border border-slate-200 p-1 rounded-lg shrink-0">
          <button 
            onClick={() => onLayoutChange("list")}
            className={`p-1.5 rounded-md transition-colors ${layout === "list" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onLayoutChange("grid")}
            className={`p-1.5 rounded-md transition-colors ${layout === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
