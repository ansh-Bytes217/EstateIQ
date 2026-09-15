import React from "react";
import { Property } from "../../../types";
import { PropertyCard } from "../../../components/shared/PropertyCard";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchErrorState } from "./SearchErrorState";

interface SearchResultsProps {
  properties: Property[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  layout: "grid" | "list";
}

export const SearchResults = ({ properties, isLoading, isError, refetch, layout }: SearchResultsProps) => {
  if (isError) {
    return <SearchErrorState onRetry={refetch} />;
  }

  if (isLoading && properties.length === 0) {
    // Skeleton Loading
    return (
      <div className={`grid gap-6 ${layout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className={`bg-slate-200 ${layout === "grid" ? "h-60" : "h-60 sm:h-auto sm:w-80"}`} />
            <div className="p-5 space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="flex gap-4 pt-2">
                <div className="h-4 bg-slate-200 rounded w-16"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return <SearchEmptyState />;
  }

  return (
    <div className={`grid gap-6 ${layout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} layout={layout} />
      ))}
      
      {/* Overlay loading state when paginating/filtering */}
      {isLoading && properties.length > 0 && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-start justify-center pt-24">
          <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
            <span className="text-sm font-semibold text-slate-700">Updating results...</span>
          </div>
        </div>
      )}
    </div>
  );
};
