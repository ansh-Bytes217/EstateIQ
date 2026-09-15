import React from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";

export const PriceFilter = () => {
  const { filters, updateFilters } = useSearchFilters();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      updateFilters({ minPrice: undefined, maxPrice: undefined });
      return;
    }
    const [min, max] = val.split("-").map(Number);
    updateFilters({ minPrice: min || undefined, maxPrice: max || undefined });
  };

  let currentValue = "";
  if (filters.minPrice || filters.maxPrice) {
    currentValue = `${filters.minPrice || 0}-${filters.maxPrice || 999999999}`;
  }

  return (
    <select 
      value={currentValue}
      onChange={handleSelect}
      className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:border-emerald-500 min-w-[130px] shrink-0"
    >
      <option value="">Any Price</option>
      <option value="0-5000000">Under ₹50L</option>
      <option value="5000000-10000000">₹50L - ₹1Cr</option>
      <option value="10000000-20000000">₹1Cr - ₹2Cr</option>
      <option value="20000000-50000000">₹2Cr - ₹5Cr</option>
      <option value="50000000-999999999">Above ₹5Cr</option>
    </select>
  );
};
