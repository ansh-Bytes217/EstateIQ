import { create } from "zustand";
import { Role, MaintenanceTicket, TourBooking, LeadInquiry, Tenancy } from "../types";

const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: "t-101",
    propertyTitle: "Modern Minimalist Apartment #4B",
    tenantName: "Aarav Sharma",
    category: "Plumbing",
    issue: "Water leakage beneath the kitchen sink causing moisture buildup",
    urgency: "HIGH",
    status: "IN_PROGRESS",
    createdAt: "2 hours ago",
    estimatedResolution: "Today, 5:00 PM",
    aiDiagnostic: "High risk of subfloor moisture damage. Auto-dispatched emergency plumber contact.",
  },
  {
    id: "t-102",
    propertyTitle: "Skyline Luxury Penthouse",
    tenantName: "Elena Rostova",
    category: "HVAC",
    issue: "Master bedroom AC unit vibrating loudly and blowing ambient air",
    urgency: "ROUTINE",
    status: "OPEN",
    createdAt: "Yesterday",
    estimatedResolution: "Tomorrow, 11:00 AM",
    aiDiagnostic: "Probable blower capacitor or loose fan mount. Standard HVAC technician scheduled.",
  },
  {
    id: "t-103",
    propertyTitle: "Serene Villa by the Lake",
    tenantName: "Rohan & Priya Patel",
    category: "Electrical",
    issue: "Main circuit breaker tripping intermittently when running microwave and oven",
    urgency: "CRITICAL",
    status: "OPEN",
    createdAt: "30 mins ago",
    estimatedResolution: "Within 2 hours",
    aiDiagnostic: "Circuit overload hazard on 20A shared breaker. Advised tenant not to reset breaker.",
  },
];

const INITIAL_BOOKINGS: TourBooking[] = [
  {
    id: "b-201",
    propertyId: "p1",
    propertyTitle: "Skyline Luxury Penthouse",
    buyerName: "Vikram Malhotra",
    buyerContact: "+91 98200 12345",
    date: "Tomorrow",
    time: "2:30 PM",
    status: "CONFIRMED",
  },
  {
    id: "b-202",
    propertyId: "p2",
    propertyTitle: "Serene Villa by the Lake",
    buyerName: "Ananya Deshmukh",
    buyerContact: "+91 97110 54321",
    date: "Friday",
    time: "11:00 AM",
    status: "PENDING",
  },
];

const INITIAL_LEADS: LeadInquiry[] = [
  {
    id: "l-301",
    clientName: "Michael Chen",
    propertyTitle: "Skyline Luxury Penthouse",
    email: "m.chen@example.com",
    phone: "+91 98112 34567",
    message: "Interested in the Worli sea face penthouse. Is the price negotiable for an all-cash quick closing?",
    score: 95,
    tier: "HOT",
    status: "NEW",
    timestamp: "15 mins ago",
    aiSuggestedReply: "Dear Michael, thank you for your strong interest. For qualified all-cash buyers, the seller is open to structured discussions. I'd love to schedule an exclusive private viewing this Thursday at 3 PM. Does that work for you?",
  },
  {
    id: "l-302",
    clientName: "Emma Watson",
    propertyTitle: "Serene Villa by the Lake",
    email: "emma.w@fintechcorp.io",
    phone: "+91 99220 98765",
    message: "Looking for a quiet villa near tech parks in Whitefield. What are the monthly maintenance charges?",
    score: 82,
    tier: "WARM",
    status: "CONTACTED",
    timestamp: "3 hours ago",
    aiSuggestedReply: "Hi Emma! The monthly society maintenance is approximately ₹8,500/mo covering 24/7 power backup, clubhouse, and tennis court upkeep. Would you like me to share the complete floor plan and HOA disclosure package?",
  },
  {
    id: "l-303",
    clientName: "David Miller",
    propertyTitle: "Modern Minimalist Apartment",
    email: "david.miller@outlook.com",
    phone: "+91 98711 22334",
    message: "Is this unit available for immediate 1-year lease? Does it include reserved parking?",
    score: 74,
    tier: "WARM",
    status: "VIEWING_SCHEDULED",
    timestamp: "Yesterday",
    aiSuggestedReply: "Hello David! Yes, the apartment is available immediately and includes 1 covered basement parking slot. Let's meet at the reception tomorrow at 11 AM.",
  },
];

const INITIAL_TENANCIES: Tenancy[] = [
  {
    id: "ten-1",
    propertyTitle: "Modern Minimalist Apartment",
    unit: "Unit 402",
    tenantName: "Aarav Sharma",
    tenantEmail: "aarav.sharma@example.com",
    monthlyRent: 85000,
    leaseStart: "2024-04-01",
    leaseEnd: "2027-03-31",
    paymentStatus: "PAID",
    deposit: 255000,
  },
  {
    id: "ten-2",
    propertyTitle: "Skyline Luxury Penthouse",
    unit: "Penthouse A",
    tenantName: "Elena Rostova",
    tenantEmail: "elena.rostova@globalventures.com",
    monthlyRent: 220000,
    leaseStart: "2024-01-15",
    leaseEnd: "2027-01-14",
    paymentStatus: "PENDING",
    deposit: 660000,
  },
  {
    id: "ten-3",
    propertyTitle: "Urban Studio Loft",
    unit: "Studio 12",
    tenantName: "Kabir Mehta",
    tenantEmail: "kabir.m@designstudio.in",
    monthlyRent: 42000,
    leaseStart: "2023-11-01",
    leaseEnd: "2026-10-31",
    paymentStatus: "OVERDUE",
    deposit: 126000,
  },
];

interface UIState {
  role: Role;
  setRole: (role: Role) => void;
  currency: "INR" | "USD";
  setCurrency: (currency: "INR" | "USD") => void;
  
  // Property Wishlist & Compare
  savedPropertyIds: string[];
  toggleSaved: (id: string) => void;
  comparePropertyIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  // AI Copilot state
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMode: "buy" | "sell" | "rent" | "insights";
  setCopilotMode: (mode: "buy" | "sell" | "rent" | "insights") => void;

  // Domain Store Data
  maintenanceTickets: MaintenanceTicket[];
  addMaintenanceTicket: (ticket: Omit<MaintenanceTicket, "id" | "createdAt" | "status">) => MaintenanceTicket;
  updateTicketStatus: (id: string, status: MaintenanceTicket["status"]) => void;

  tourBookings: TourBooking[];
  addTourBooking: (booking: Omit<TourBooking, "id" | "status">) => TourBooking;

  leads: LeadInquiry[];
  updateLeadStatus: (id: string, status: LeadInquiry["status"]) => void;

  tenancies: Tenancy[];
  updateRentPaymentStatus: (id: string, status: Tenancy["paymentStatus"]) => void;

  // Demo Mode for Recruiters & Evaluation
  demoMode: boolean;
  toggleDemoMode: () => void;
}

export const useStore = create<UIState>((set) => ({
  role: "BUYER",
  setRole: (role) => {
    let mode: "buy" | "sell" | "rent" | "insights" = "buy";
    if (role === "TENANT") mode = "rent";
    else if (role === "LANDLORD") mode = "sell";
    else if (role === "AGENT") mode = "insights";
    set({ role, copilotMode: mode });
  },
  currency: "INR",
  setCurrency: (currency) => set({ currency }),

  savedPropertyIds: ["p1", "p2"],
  toggleSaved: (id) =>
    set((state) => ({
      savedPropertyIds: state.savedPropertyIds.includes(id)
        ? state.savedPropertyIds.filter((pid) => pid !== id)
        : [...state.savedPropertyIds, id],
    })),

  comparePropertyIds: ["p1", "p2"],
  toggleCompare: (id) =>
    set((state) => {
      if (state.comparePropertyIds.includes(id)) {
        return { comparePropertyIds: state.comparePropertyIds.filter((pid) => pid !== id) };
      }
      if (state.comparePropertyIds.length < 4) {
        return { comparePropertyIds: [...state.comparePropertyIds, id] };
      }
      return state;
    }),
  clearCompare: () => set({ comparePropertyIds: [] }),

  copilotOpen: false,
  setCopilotOpen: (copilotOpen) => set({ copilotOpen }),
  copilotMode: "buy",
  setCopilotMode: (copilotMode) => set({ copilotMode }),

  maintenanceTickets: INITIAL_TICKETS,
  addMaintenanceTicket: (ticketInput) => {
    const newTicket: MaintenanceTicket = {
      ...ticketInput,
      id: `t-${Date.now().toString().slice(-4)}`,
      createdAt: "Just now",
      status: "OPEN",
    };
    set((state) => ({ maintenanceTickets: [newTicket, ...state.maintenanceTickets] }));
    return newTicket;
  },
  updateTicketStatus: (id, status) =>
    set((state) => ({
      maintenanceTickets: state.maintenanceTickets.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  tourBookings: INITIAL_BOOKINGS,
  addTourBooking: (bookingInput) => {
    const newBooking: TourBooking = {
      ...bookingInput,
      id: `b-${Date.now().toString().slice(-4)}`,
      status: "CONFIRMED",
    };
    set((state) => ({ tourBookings: [newBooking, ...state.tourBookings] }));
    return newBooking;
  },

  leads: INITIAL_LEADS,
  updateLeadStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    })),

  tenancies: INITIAL_TENANCIES,
  updateRentPaymentStatus: (id, status) =>
    set((state) => ({
      tenancies: state.tenancies.map((t) => (t.id === id ? { ...t, paymentStatus: status } : t)),
    })),

  demoMode: true,
  toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),
}));
