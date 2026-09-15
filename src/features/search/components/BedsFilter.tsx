import React from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";

export const BedsFilter = () => {
  const { filters, updateFilters } = useSearchFilters();

  return (
    <select 
      value={filters.beds || ""}
      onChange={(e) => updateFilters({ beds: e.target.value ? Number(e.target.value) : undefined })}
      className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 min-w-[110px] shrink-0"
    >
      <option value="">Any Beds</option>
      <option value="1">1+ Beds</option>
      <option value="2">2+ Beds</option>
      <option value="3">3+ Beds</option>
      <option value="4">4+ Beds</option>
      <option value="5">5+ Beds</option>
    </select>
  );
};
