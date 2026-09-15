import { useSearchParams } from "react-router-dom";
import { SearchFilters } from "../types/search";
import { useCallback, useMemo } from "react";

export const useSearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<SearchFilters>(() => {
    const f: SearchFilters = {};
    const intent = searchParams.get("intent");
    if (intent === "buy" || intent === "rent" || intent === "new") f.intent = intent;
    
    const city = searchParams.get("city");
    if (city) f.city = city;

    const minPrice = searchParams.get("minPrice");
    if (minPrice) f.minPrice = Number(minPrice);
    
    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) f.maxPrice = Number(maxPrice);
    
    // QuickSearch sets price as min-max string, handle legacy support
    const priceStr = searchParams.get("price");
    if (priceStr) {
      const parts = priceStr.split("-");
      if (parts[0]) f.minPrice = Number(parts[0]);
      if (parts[1]) f.maxPrice = Number(parts[1]);
    }

    const beds = searchParams.get("beds");
    if (beds) f.beds = Number(beds);

    const baths = searchParams.get("baths");
    if (baths) f.baths = Number(baths);

    const propertyType = searchParams.get("propertyType") || searchParams.get("type"); // fallback for quicksearch
    if (propertyType) f.propertyType = propertyType.split(",");

    const furnishing = searchParams.get("furnishing");
    if (furnishing) f.furnishing = furnishing.split(",");

    const sort = searchParams.get("sort");
    if (sort) f.sort = sort as SearchFilters["sort"];

    const page = searchParams.get("page");
    if (page) f.page = Number(page);

    const boundsStr = searchParams.get("bounds");
    if (boundsStr) {
      const [north, south, east, west] = boundsStr.split(",").map(Number);
      if (!isNaN(north) && !isNaN(south) && !isNaN(east) && !isNaN(west)) {
        f.bounds = { north, south, east, west };
      }
    }

    return f;
  }, [searchParams]);

  const updateFilters = useCallback((updates: Partial<SearchFilters>, replace = false) => {
    setSearchParams(prev => {
      const next = replace ? new URLSearchParams() : new URLSearchParams(prev);
      
      // Clean up legacy quicksearch params if they are being overwritten
      if (updates.minPrice !== undefined || updates.maxPrice !== undefined) {
        next.delete("price");
      }
      if (updates.propertyType !== undefined) {
        next.delete("type");
      }

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
          next.delete(key);
        } else if (key === "bounds" && typeof value === "object" && value !== null) {
          const { north, south, east, west } = value as any;
          next.set("bounds", `${north},${south},${east},${west}`);
        } else if (Array.isArray(value)) {
          next.set(key, value.join(","));
        } else {
          next.set(key, String(value));
        }
      });
      
      // Reset to page 1 on any filter change other than page itself
      if (!updates.page && next.get("page")) {
        next.delete("page");
      }
      
      return next;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, updateFilters, clearFilters };
};
