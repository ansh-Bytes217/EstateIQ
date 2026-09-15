import { useQuery } from "@tanstack/react-query";
import { propertyService } from "../../../services/propertyService";
import { SearchFilters } from "../types/search";

export const usePropertySearch = (filters: SearchFilters) => {
  return useQuery({
    queryKey: ["properties", "search", filters],
    queryFn: () => propertyService.searchProperties(filters),
    placeholderData: (previousData) => previousData, // keep old data while fetching
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
