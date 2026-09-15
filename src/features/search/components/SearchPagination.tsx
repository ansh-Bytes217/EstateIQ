import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchFilters } from "../hooks/useSearchFilters";

interface SearchPaginationProps {
  currentPage: number;
  totalPages: number;
}

export const SearchPagination = ({ currentPage, totalPages }: SearchPaginationProps) => {
  const { updateFilters } = useSearchFilters();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      <button
        onClick={() => updateFilters({ page: currentPage - 1 })}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => updateFilters({ page })}
              className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                isCurrent 
                  ? "bg-emerald-600 text-white border-emerald-600" 
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => updateFilters({ page: currentPage + 1 })}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
