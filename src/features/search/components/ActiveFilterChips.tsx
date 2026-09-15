import React from "react";
import { X } from "lucide-react";
import { useSearchFilters } from "../hooks/useSearchFilters";

export const ActiveFilterChips = () => {
  const { filters, updateFilters, clearFilters } = useSearchFilters();

  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.city) {
    chips.push({ label: filters.city, onRemove: () => updateFilters({ city: undefined }) });
  }

  if (filters.minPrice || filters.maxPrice) {
    let label = "";
    if (filters.minPrice && filters.maxPrice) {
      label = `₹${(filters.minPrice / 100000).toFixed(0)}L - ₹${(filters.maxPrice / 10000000).toFixed(1)}Cr`;
    } else if (filters.minPrice) {
      label = `> ₹${(filters.minPrice / 100000).toFixed(0)}L`;
    } else if (filters.maxPrice) {
      label = `< ₹${(filters.maxPrice / 10000000).toFixed(1)}Cr`;
    }
    chips.push({ label, onRemove: () => updateFilters({ minPrice: undefined, maxPrice: undefined }) });
  }

  if (filters.beds) {
    chips.push({ label: `${filters.beds}+ Beds`, onRemove: () => updateFilters({ beds: undefined }) });
  }

  if (filters.baths) {
    chips.push({ label: `${filters.baths}+ Baths`, onRemove: () => updateFilters({ baths: undefined }) });
  }

  if (filters.propertyType && filters.propertyType.length > 0) {
    filters.propertyType.forEach(type => {
      chips.push({ 
        label: type.charAt(0).toUpperCase() + type.slice(1), 
        onRemove: () => {
          const newTypes = filters.propertyType!.filter(t => t !== type);
          updateFilters({ propertyType: newTypes.length > 0 ? newTypes : undefined });
        } 
      });
    });
  }

  if (filters.furnishing && filters.furnishing.length > 0) {
    filters.furnishing.forEach(type => {
      chips.push({ 
        label: type.charAt(0).toUpperCase() + type.slice(1), 
        onRemove: () => {
          const newTypes = filters.furnishing!.filter(t => t !== type);
          updateFilters({ furnishing: newTypes.length > 0 ? newTypes : undefined });
        } 
      });
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="bg-white border-b border-slate-100 px-4 py-3 z-0">
      <div className="container mx-auto max-w-7xl flex flex-wrap items-center gap-2">
        {chips.map((chip, idx) => (
          <div key={`${chip.label}-${idx}`} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100 animate-in fade-in zoom-in duration-200">
            {chip.label}
            <button 
              onClick={chip.onRemove}
              className="p-0.5 rounded-full hover:bg-emerald-200 text-emerald-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {chips.length > 1 && (
          <button 
            onClick={clearFilters}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 underline ml-2 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};
