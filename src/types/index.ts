export type Role = "BUYER" | "AGENT" | "LANDLORD" | "TENANT";

export interface Property {
  id: string;
  title: string;
  type: "Apartment" | "Villa" | "Penthouse" | "Commercial";
  status: "For Sale" | "For Rent";
  price: number;
  location: {
    city: string;
    locality: string;
    coordinates: [number, number]; // [lat, lng]
  };
  specs: {
    beds: number;
    baths: number;
    area: number; // sqft
    furnishing: "Furnished" | "Semi-Furnished" | "Unfurnished";
  };
  amenities: string[];
  images: string[];
  agentId: string;
  featured?: boolean;
  isNewConstruction?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  image: string;
  rating: number;
}
