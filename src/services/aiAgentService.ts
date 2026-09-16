import { MOCK_PROPERTIES } from "../data/mockData";
import { Property, MaintenanceTicket, TourBooking } from "../types";

export interface MortgageCalculation {
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  monthlyEMI: number;
  totalPayment: number;
  totalInterest: number;
  estimatedRentalYield?: number;
}

export interface MaintenanceTriageResult {
  category: MaintenanceTicket["category"];
  urgency: MaintenanceTicket["urgency"];
  diagnostic: string;
  recommendedAction: string;
  estimatedResolution: string;
}

export interface ListingDraftResult {
  title: string;
  headline: string;
  description: string;
  keyFeatures: string[];
  targetAudience: string;
  suggestedPriceRange: string;
}

export interface ClauseAnalysisResult {
  clauseSummary: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  tenantObligations: string[];
  landlordObligations: string[];
  keyAdvice: string;
}

export interface AIActionResult {
  type: "properties" | "mortgage" | "tour" | "maintenance" | "listing" | "clause";
  data: Property[] | MortgageCalculation | TourBooking | MaintenanceTriageResult | ListingDraftResult | ClauseAnalysisResult;
}

export interface AIAgentResponse {
  message: string;
  actionResult?: AIActionResult;
}

/**
 * Intelligent EstateIQ Agentic Engine
 * Supports autonomous multi-persona workflows:
 * - Buyer: Semantic property search, mortgage / EMI calculation, commute check
 * - Tenant: Maintenance diagnostics & dispatch, lease clause Q&A, rent schedule
 * - Agent: Lead response drafting, listing copy generation, tour booking
 * - Landlord/Seller: Valuation CMA, ROI & cap rate calculator, tenant risk score
 */
export async function executeAgentQuery({
  query,
  mode,
  currency = "INR",
  onScheduleTour,
  onCreateMaintenanceTicket,
}: {
  query: string;
  mode: "buy" | "sell" | "rent" | "insights";
  currency?: "INR" | "USD";
  onScheduleTour?: (tour: Omit<TourBooking, "id" | "status">) => TourBooking;
  onCreateMaintenanceTicket?: (ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "status">) => MaintenanceTicket;
}): Promise<AIAgentResponse> {
  const normalized = query.toLowerCase();

  // Simulate network thinking latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  // TOOL 1: Tour Booking
  if (
    normalized.includes("schedule") ||
    normalized.includes("book") ||
    normalized.includes("tour") ||
    normalized.includes("viewing")
  ) {
    const targetProp = MOCK_PROPERTIES[0];
    const bookingData: TourBooking = {
      id: `b-${Date.now().toString().slice(-4)}`,
      propertyId: targetProp.id,
      propertyTitle: targetProp.title,
      buyerName: "Current User",
      buyerContact: "+91 98000 11223",
      date: "Tomorrow",
      time: "3:00 PM",
      status: "CONFIRMED",
    };

    if (onScheduleTour) {
      onScheduleTour({
        propertyId: targetProp.id,
        propertyTitle: targetProp.title,
        buyerName: "Current User",
        buyerContact: "+91 98000 11223",
        date: "Tomorrow",
        time: "3:00 PM",
      });
    }

    return {
      message: `I've booked a private viewing for you at **${targetProp.title}** on **Tomorrow at 3:00 PM**. The listing agent Sarah Jenkins has been notified and will have the entry passes ready.`,
      actionResult: {
        type: "tour",
        data: bookingData,
      },
    };
  }

  // TOOL 2: Maintenance Triage for Tenants
  if (
    mode === "rent" ||
    normalized.includes("leak") ||
    normalized.includes("broken") ||
    normalized.includes("repair") ||
    normalized.includes("plumbing") ||
    normalized.includes("ac") ||
    normalized.includes("electric") ||
    normalized.includes("maintenance")
  ) {
    let category: MaintenanceTicket["category"] = "General";
    let urgency: MaintenanceTicket["urgency"] = "ROUTINE";
    let diagnostic = "Standard maintenance triage performed.";
    let turnaround = "Within 48 hours";

    if (normalized.includes("leak") || normalized.includes("water") || normalized.includes("pipe") || normalized.includes("plumbing")) {
      category = "Plumbing";
      urgency = normalized.includes("flood") || normalized.includes("burst") ? "CRITICAL" : "HIGH";
      diagnostic = "Water ingress detected. High probability of internal pipe fitting failure or drain trap leak.";
      turnaround = urgency === "CRITICAL" ? "Under 2 hours" : "Within 24 hours";
    } else if (normalized.includes("spark") || normalized.includes("breaker") || normalized.includes("power") || normalized.includes("electric")) {
      category = "Electrical";
      urgency = "CRITICAL";
      diagnostic = "Electrical safety hazard. Potential short circuit or breaker overload.";
      turnaround = "Under 2 hours (Emergency Dispatch)";
    } else if (normalized.includes("ac") || normalized.includes("heat") || normalized.includes("hvac") || normalized.includes("cooling")) {
      category = "HVAC";
      urgency = "HIGH";
      diagnostic = "Compressor or refrigerant pressure irregularity. Airflow efficiency compromised.";
      turnaround = "Next Business Day";
    }

    const triageData: MaintenanceTriageResult = {
      category,
      urgency,
      diagnostic,
      recommendedAction: urgency === "CRITICAL" ? "Turn off the main isolation valve/breaker immediately while the contractor is in transit." : "Avoid using the fixture to prevent secondary water/heat damage.",
      estimatedResolution: turnaround,
    };

    if (onCreateMaintenanceTicket) {
      onCreateMaintenanceTicket({
        propertyTitle: "Current Residence - Unit 402",
        tenantName: "Tenant User",
        category,
        issue: query,
        urgency,
        estimatedResolution: turnaround,
        aiDiagnostic: diagnostic,
      });
    }

    return {
      message: `I've diagnosed your issue as a **${urgency}** priority **${category}** request. A ticket has been automatically logged with building management and dispatched to qualified service partners.`,
      actionResult: {
        type: "maintenance",
        data: triageData,
      },
    };
  }

  // TOOL 3: Mortgage / EMI & Investment Calculator
  if (
    normalized.includes("mortgage") ||
    normalized.includes("emi") ||
    normalized.includes("loan") ||
    normalized.includes("down payment") ||
    normalized.includes("roi") ||
    normalized.includes("yield") ||
    normalized.includes("worth")
  ) {
    const price = currency === "USD" ? 450000 : 15000000;
    const downPayment = price * 0.2;
    const loan = price - downPayment;
    const annualRate = 0.085;
    const monthlyRate = annualRate / 12;
    const months = 20 * 12;
    const emi = Math.round((loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loan;

    const calcData: MortgageCalculation = {
      propertyPrice: price,
      downPayment,
      loanAmount: loan,
      interestRate: 8.5,
      loanTermYears: 20,
      monthlyEMI: emi,
      totalPayment,
      totalInterest,
      estimatedRentalYield: 4.8,
    };

    return {
      message: `Here is the financial breakdown based on current prime lending rates (**8.5% p.a.** over **20 years** with **20% down payment**):`,
      actionResult: {
        type: "mortgage",
        data: calcData,
      },
    };
  }

  // TOOL 4: Listing Copy Generator for Sellers & Agents
  if (
    mode === "sell" ||
    normalized.includes("list") ||
    normalized.includes("draft") ||
    normalized.includes("copy") ||
    normalized.includes("description") ||
    normalized.includes("sell")
  ) {
    const listingData: ListingDraftResult = {
      title: "Architectural Haven with Panoramic Skyline Views & Luxury Finishes",
      headline: "Exquisite 3-Bedroom Residence Engineered for Modern Luxury & Effortless Living",
      description:
        "Welcome to a masterclass in contemporary living. Bathed in natural light with soaring 11-foot ceilings, Italian marble flooring, and smart-home climate automation. The expansive chef's kitchen features imported quartz countertops and German appliances, flowing seamlessly into a private wraparound sunset balcony.",
      keyFeatures: [
        "Floor-to-ceiling soundproof double-glazed acoustic windows",
        "Designer modular kitchen with integrated breakfast bar",
        "Dedicated EV fast-charging dual parking bays",
        "5-tier biometric building security & concierge service",
      ],
      targetAudience: "Executive families, tech professionals, and discerning luxury investors",
      suggestedPriceRange: currency === "USD" ? "$780,000 - $825,000" : "₹3.8 Cr - ₹4.2 Cr",
    };

    return {
      message: `Here is a high-converting listing brief optimized for high buyer engagement and portal SEO:`,
      actionResult: {
        type: "listing",
        data: listingData,
      },
    };
  }

  // TOOL 5: Lease Clause / Legal Agreement Analysis
  if (
    normalized.includes("lease") ||
    normalized.includes("clause") ||
    normalized.includes("contract") ||
    normalized.includes("agreement") ||
    normalized.includes("deposit") ||
    normalized.includes("renewal")
  ) {
    const clauseData: ClauseAnalysisResult = {
      clauseSummary: "Standard 11-Month Tenancy with 5% Annual Escalation & 60-Day Mutual Notice Clause",
      riskLevel: "LOW",
      tenantObligations: [
        "Responsible for internal minor repairs under ₹1,500/incident",
        "Must provide 60-day written notice prior to departure to ensure full security deposit refund",
      ],
      landlordObligations: [
        "Maintain external structural elements, roof waterproofing, and main utility lines",
        "Return refundable security deposit within 14 banking days of key handover",
      ],
      keyAdvice: "The agreement is balanced and SAIF/RERA compliant. Ensure pre-move-in condition checklist is signed by both parties.",
    };

    return {
      message: `I've analyzed the tenancy terms for you. Here is the legal breakdown:`,
      actionResult: {
        type: "clause",
        data: clauseData,
      },
    };
  }

  // TOOL 6: Property Search & Matching (Default fallback tool)
  let matched = MOCK_PROPERTIES;
  if (normalized.includes("mumbai")) {
    matched = matched.filter((p) => p.location.city.toLowerCase().includes("mumbai"));
  } else if (normalized.includes("bangalore")) {
    matched = matched.filter((p) => p.location.city.toLowerCase().includes("bangalore"));
  } else if (normalized.includes("rent")) {
    matched = matched.filter((p) => p.status === "For Rent");
  } else if (normalized.includes("villa")) {
    matched = matched.filter((p) => p.type.toLowerCase().includes("villa"));
  } else if (normalized.includes("penthouse")) {
    matched = matched.filter((p) => p.type.toLowerCase().includes("penthouse"));
  }

  if (matched.length === 0) matched = MOCK_PROPERTIES.slice(0, 3);

  return {
    message: `I found **${matched.length} properties** matching your criteria with verified titles and high investment compatibility:`,
    actionResult: {
      type: "properties",
      data: matched,
    },
  };
}
