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
  zestimate?: Zestimate;
  priceHistory?: PriceHistoryEvent[];
  taxHistory?: TaxHistoryRecord[];
  schools?: SchoolInfo[];
  scores?: LocationScores;
  climateRisks?: ClimateRiskInfo;
  monthlyCosts?: MonthlyCostDefaults;
  floorPlanImage?: string;
}

export interface Zestimate {
  estimatedValue: number;
  rangeLow: number;
  rangeHigh: number;
  oneYearForecastPercent: number;
  thirtyDayChange: number;
  estimatedRent?: number;
  confidenceScore: number;
}

export interface PriceHistoryEvent {
  date: string;
  event: "Listed" | "Price Change" | "Sold" | "Pending";
  price: number;
  priceChangePercent?: number;
  source: string;
}

export interface TaxHistoryRecord {
  year: number;
  propertyTax: number;
  taxAssessment: number;
}

export interface SchoolInfo {
  name: string;
  rating: number; // 1-10
  type: "Public" | "Private";
  grades: string;
  distance: string;
}

export interface LocationScores {
  walkScore: number;
  walkDescription: string;
  transitScore: number;
  transitDescription: string;
  bikeScore: number;
  bikeDescription: string;
}

export interface ClimateRiskInfo {
  floodRisk: "Minimal" | "Moderate" | "Major" | "Severe";
  fireRisk: "Minimal" | "Moderate" | "Major" | "Severe";
  heatRisk: "Minimal" | "Moderate" | "Major" | "Severe";
}

export interface MonthlyCostDefaults {
  hoaFee: number;
  propertyTaxRatePercent: number;
  homeownersInsuranceRatePercent: number;
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

