import { MapBounds } from "../../map/types/map";

export interface SearchFilters {
  intent?: "buy" | "rent" | "new" | "";
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string[];
  furnishing?: string[];
  sort?: "recommended" | "newest" | "price_asc" | "price_desc" | "area_asc" | "area_desc";
  page?: number;
  limit?: number;
  bounds?: MapBounds;
}
