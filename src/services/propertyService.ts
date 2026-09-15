import { Property } from "../types";
import { MOCK_PROPERTIES } from "../data/mockData";
import { SearchFilters } from "../features/search/types/search";

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const propertyService = {
  async searchProperties(filters: SearchFilters): Promise<PaginatedResult<Property>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let results = [...MOCK_PROPERTIES];

    // Filter by intent
    if (filters.intent) {
      if (filters.intent === "buy") {
        results = results.filter(p => p.status === "For Sale" && !p.isNewConstruction);
      } else if (filters.intent === "rent") {
        results = results.filter(p => p.status === "For Rent");
      } else if (filters.intent === "new") {
        results = results.filter(p => p.isNewConstruction);
      }
    }

    // Filter by city
    if (filters.city) {
      const searchCity = filters.city.toLowerCase();
      results = results.filter(p => p.location.city.toLowerCase().includes(searchCity) || p.location.locality.toLowerCase().includes(searchCity));
    }

    // Filter by price
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice!);
    }

    // Filter by beds
    if (filters.beds !== undefined) {
      results = results.filter(p => p.specs.beds >= filters.beds!);
    }

    // Filter by baths
    if (filters.baths !== undefined) {
      results = results.filter(p => p.specs.baths >= filters.baths!);
    }

    // Filter by propertyType
    if (filters.propertyType && filters.propertyType.length > 0) {
      results = results.filter(p => filters.propertyType!.includes(p.type.toLowerCase()));
    }

    // Filter by furnishing
    if (filters.furnishing && filters.furnishing.length > 0) {
      results = results.filter(p => filters.furnishing!.includes(p.specs.furnishing.toLowerCase()));
    }

    // Filter by bounds (Search as I move)
    if (filters.bounds) {
      const { north, south, east, west } = filters.bounds;
      results = results.filter(p => {
        const [lat, lng] = p.location.coordinates;
        return lat >= south && lat <= north && lng >= west && lng <= east;
      });
    }

    // Sort
    if (filters.sort) {
      switch (filters.sort) {
        case "price_asc":
          results.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          results.sort((a, b) => b.price - a.price);
          break;
        case "area_asc":
          results.sort((a, b) => a.specs.area - b.specs.area);
          break;
        case "area_desc":
          results.sort((a, b) => b.specs.area - a.specs.area);
          break;
        case "newest":
          // Mock data doesn't have dates, just reverse the array to simulate
          results.reverse();
          break;
        case "recommended":
        default:
          // Default sorting (e.g., featured first)
          results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    } else {
      results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    // Pagination
    const page = filters.page || 1;
    const pageSize = filters.limit || 10;
    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = results.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      page,
      pageSize,
      total,
      totalPages,
    };
  },

  async getLocationSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const cities = ["Ahmedabad", "Vadodara", "Mumbai", "Pune", "Bangalore", "New Delhi", "Gurugram", "Surat", "Hyderabad", "Chennai"];
    return cities.filter(c => c.toLowerCase().includes(query.toLowerCase()));
  }
};
