import React from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/Button";

// We'll create specialized components for these next
import { PriceFilter } from "./PriceFilter";
import { BedsFilter } from "./BedsFilter";
import { PropertyTypeFilter } from "./PropertyTypeFilter";

export const SearchFiltersBar = ({ onOpenAdvanced }: { onOpenAdvanced: () => void }) => {
  const { filters, updateFilters } = useSearchFilters();

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 z-10 sticky top-[136px] sm:top-[128px]">
      <div className="container mx-auto max-w-7xl flex flex-wrap items-center gap-3">
        {/* Intent Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => updateFilters({ intent: "buy" })}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filters.intent === "buy" || !filters.intent ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Buy
          </button>
          <button
            onClick={() => updateFilters({ intent: "rent" })}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filters.intent === "rent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Rent
          </button>
          <button
            onClick={() => updateFilters({ intent: "new" })}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filters.intent === "new" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            New Launch
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block mx-1 shrink-0"></div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-1">
          <PriceFilter />
          <BedsFilter />
          <PropertyTypeFilter />
          
          <Button variant="outline" size="sm" onClick={onOpenAdvanced} className="gap-2 shrink-0 h-9 ml-auto text-slate-700 bg-slate-50 hover:bg-slate-100">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
