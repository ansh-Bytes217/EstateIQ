import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useSearchFilters } from "../hooks/useSearchFilters";

export const SearchEmptyState = () => {
  const { clearFilters } = useSearchFilters();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
        <SearchX className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">No homes match your search</h2>
      <p className="text-slate-600 max-w-md mb-8">
        We couldn't find any properties that match all your current filters. Try removing a filter, expanding your price range, or searching in a different area.
      </p>
      <Button onClick={clearFilters} variant="outline" size="lg">
        Clear All Filters
      </Button>
    </div>
  );
};
