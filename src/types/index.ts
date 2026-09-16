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

export interface MaintenanceTicket {
  id: string;
  propertyTitle: string;
  tenantName: string;
  category: "Plumbing" | "Electrical" | "HVAC" | "Appliance" | "Structural" | "General";
  issue: string;
  urgency: "CRITICAL" | "HIGH" | "ROUTINE";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  estimatedResolution: string;
  aiDiagnostic?: string;
}

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerName: string;
  buyerContact?: string;
  date: string;
  time: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED";
}

export interface LeadInquiry {
  id: string;
  clientName: string;
  propertyTitle: string;
  email: string;
  phone: string;
  message: string;
  score: number; // 0 - 100
  tier: "HOT" | "WARM" | "COLD";
  status: "NEW" | "CONTACTED" | "VIEWING_SCHEDULED";
  timestamp: string;
  aiSuggestedReply: string;
}

export interface Tenancy {
  id: string;
  propertyTitle: string;
  unit: string;
  tenantName: string;
  tenantEmail: string;
  monthlyRent: number;
  leaseStart: string;
  leaseEnd: string;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
  deposit: number;
}

