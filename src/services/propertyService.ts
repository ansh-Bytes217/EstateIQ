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

interface PublicPropertyResponse {
  id: string;
  title: string;
  description?: string;
  propertyType: string;
  listingType: "SALE" | "RENT" | "NEW_CONSTRUCTION";
  price: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  city?: string;
  locality?: string;
  furnished: boolean;
  latitude?: number;
  longitude?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const propertyImages: Record<string, string> = {
  APARTMENT: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
  VILLA: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200",
  PENTHOUSE: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
  COMMERCIAL: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200",
};

function mapPublicProperty(property: PublicPropertyResponse): Property {
  const typeMap: Record<string, Property["type"]> = { APARTMENT: "Apartment", VILLA: "Villa", PENTHOUSE: "Penthouse", COMMERCIAL: "Commercial" };
  return {
    id: property.id,
    title: property.title,
    type: typeMap[property.propertyType] || "Apartment",
    status: property.listingType === "RENT" ? "For Rent" : "For Sale",
    price: property.price,
    location: { city: property.city || "India", locality: property.locality || "", coordinates: [property.latitude || 20.5937, property.longitude || 78.9629] },
    specs: { beds: property.bedrooms || 0, baths: property.bathrooms || 0, area: property.areaSqft || 0, furnishing: property.furnished ? "Furnished" : "Unfurnished" },
    amenities: [],
    images: [propertyImages[property.propertyType] || propertyImages.APARTMENT],
    agentId: "",
  };
}

async function searchBackend(filters: SearchFilters): Promise<PaginatedResult<Property>> {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.intent) params.set("listingType", filters.intent === "buy" ? "SALE" : filters.intent === "rent" ? "RENT" : "NEW_CONSTRUCTION");
  if (filters.propertyType?.[0]) params.set("propertyType", filters.propertyType[0].toUpperCase());
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  const page = filters.page || 1;
  const pageSize = filters.limit || 10;
  params.set("page", String(page - 1));
  params.set("size", String(pageSize));

  const response = await fetch(`${API_BASE_URL}/api/v1/properties/search?${params.toString()}`);
  if (!response.ok) throw new Error(`Property API returned ${response.status}`);
  const result = await response.json() as { items: PublicPropertyResponse[]; page: number; size: number; totalElements: number; totalPages: number };
  return { items: result.items.map(mapPublicProperty), page: result.page + 1, pageSize: result.size, total: result.totalElements, totalPages: result.totalPages };
}

export const propertyService = {
  async searchProperties(filters: SearchFilters): Promise<PaginatedResult<Property>> {
    try {
      return await searchBackend(filters);
    } catch (error) {
      console.warn("Property API unavailable; using demo inventory.", error);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

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
