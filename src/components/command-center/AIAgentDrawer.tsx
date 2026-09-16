import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  X,
  Building2,
  Calculator,
  Calendar,
  Wrench,
  FileText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { executeAgentQuery, AIActionResult, MortgageCalculation, MaintenanceTriageResult, ListingDraftResult, ClauseAnalysisResult } from "../../services/aiAgentService";
import { Property, TourBooking } from "../../types";
import { Link } from "react-router-dom";

export type CommandMode = "buy" | "sell" | "rent" | "insights";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  actionResult?: AIActionResult;
  timestamp: string;
}

const personaConfigs: Record<CommandMode, {
  label: string;
  persona: string;
  headline: string;
  subtitle: string;
  placeholder: string;
  suggestions: string[];
}> = {
  buy: {
    label: "Buyer / Search",
    persona: "Buyer Acquisition Advisor",
    headline: "Discover properties matched to your lifestyle",
    subtitle: "Ask about neighborhoods, price trends, EMI calculations, or viewings.",
    placeholder: "E.g. Find 3-bed apartments in Mumbai under 4 Cr or calculate my EMI...",
    suggestions: [
      "Find luxury apartments in Mumbai",
      "Calculate 20-year EMI for ₹1.5 Cr home",
      "Schedule a viewing for Skyline Penthouse",
    ],
  },
  rent: {
    label: "Tenant Concierge",
    persona: "Tenant Lifecycle Concierge",
    headline: "Fast assistance with maintenance & leases",
    subtitle: "Triage urgent repairs, explain lease clauses, or check rent schedules.",
    placeholder: "E.g. Kitchen pipe leaking under sink or review my lease renewal notice...",
    suggestions: [
      "Water leakage in kitchen sink",
      "AC vibrating loudly and blowing warm air",
      "Explain the 60-day lease termination clause",
    ],
  },
  sell: {
    label: "Landlord / Seller",
    persona: "Asset & Yield Strategist",
    headline: "Maximize valuation & rental cash flow",
    subtitle: "Draft high-converting listings, optimize rental yields, or screen tenants.",
    placeholder: "E.g. Draft an enticing listing description for my luxury villa...",
    suggestions: [
      "Draft a luxury listing for my 3-bed villa",
      "Calculate rental yield and cap rate",
      "What upgrades maximize resale ROI?",
    ],
  },
  insights: {
    label: "Agent Copilot",
    persona: "Broker Ops & Deal Assistant",
    headline: "Streamline client follow-ups & transactions",
    subtitle: "Draft buyer follow-ups, prep property briefs, and structure deal contracts.",
    placeholder: "E.g. Draft a follow-up response for high-intent penthouse lead...",
    suggestions: [
      "Draft follow-up for Michael Chen (Cash Buyer)",
      "Prepare a buyer tour brief for tomorrow",
      "Generate marketing copy for social media",
    ],
  },
};

export interface AIAgentDrawerProps {
  mode?: CommandMode;
  open?: boolean;
  onClose?: () => void;
}

export function AIAgentDrawer({ mode: propMode, open: propOpen, onClose }: AIAgentDrawerProps = {}) {
  const {
    copilotOpen: storeOpen,
    setCopilotOpen: setStoreOpen,
    copilotMode: storeMode,
    setCopilotMode: setStoreMode,
    currency,
    addTourBooking,
    addMaintenanceTicket,
  } = useStore();

  const open = propOpen !== undefined ? propOpen : storeOpen;
  const setOpen = (val: boolean) => {
    setStoreOpen(val);
    if (!val && onClose) onClose();
  };
  const mode = propMode || storeMode;
  const setMode = (m: CommandMode) => setStoreMode(m);

  const config = personaConfigs[mode];
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      sender: "assistant",
      text: `Hello! I'm your **EstateIQ AI Agent**. How can I help you today? You can switch personas anytime or ask me to search properties, calculate mortgages, book viewings, or triage home maintenance.`,
      timestamp: "Just now",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Global shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  const handleSend = async (queryText?: string) => {
    const query = (queryText || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await executeAgentQuery({
        query,
        mode,
        currency,
        onScheduleTour: addTourBooking,
        onCreateMaintenanceTicket: addMaintenanceTicket,
      });

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "assistant",
        text: response.message,
        actionResult: response.actionResult,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "assistant",
          text: "I experienced a brief connectivity delay. Please try your request again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!open && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[65] flex items-center gap-3 rounded-full border border-emerald-400/40 bg-slate-900/95 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-emerald-950/50 backdrop-blur-xl transition hover:border-emerald-400 hover:shadow-emerald-500/20"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-md">
            <Sparkles className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
          </span>
          <span>EstateIQ Copilot</span>
          <kbd className="hidden sm:inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300">
            ⌘K
          </kbd>
        </motion.button>
      )}

      {/* Drawer Panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[80] flex w-full max-w-lg flex-col border-l border-slate-800 bg-slate-950/95 text-white shadow-2xl backdrop-blur-2xl sm:w-[500px]"
          >
            {/* Header */}
            <div className="border-b border-slate-800/80 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold tracking-tight text-white">EstateIQ Copilot</h2>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        Agentic Flow
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{config.persona}</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Persona Selector Tabs */}
              <div className="mt-4 grid grid-cols-4 gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
                {(["buy", "rent", "sell", "insights"] as const).map((tabMode) => (
                  <button
                    key={tabMode}
                    onClick={() => setMode(tabMode)}
                    className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      mode === tabMode
                        ? "bg-emerald-500 text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {personaConfigs[tabMode].label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Context Banner */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                <h3 className="text-sm font-semibold text-emerald-300">{config.headline}</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">{config.subtitle}</p>

                {/* Suggestions */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {config.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-emerald-500/50 hover:bg-emerald-950/40 hover:text-emerald-300 text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-slate-950 font-medium rounded-tr-sm"
                        : "border border-slate-800 bg-slate-900/90 text-slate-200 rounded-tl-sm shadow-md"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* ACTION RESULT WIDGET: PROPERTIES */}
                    {msg.actionResult?.type === "properties" && (
                      <div className="mt-3 space-y-2">
                        {(msg.actionResult.data as Property[]).slice(0, 3).map((property) => (
                          <div
                            key={property.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 hover:border-emerald-500/40 transition"
                          >
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-white">{property.title}</p>
                              <p className="text-xs text-emerald-400 font-bold mt-0.5">
                                {currency === "USD" ? `$${(property.price / 83).toLocaleString()}` : `₹${property.price.toLocaleString()}`}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {property.specs.beds} Beds • {property.specs.baths} Baths • {property.location.city}
                              </p>
                            </div>
                            <Link
                              to={`/properties/${property.id}`}
                              onClick={() => setOpen(false)}
                              className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-emerald-500 hover:text-slate-950 transition"
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ACTION RESULT WIDGET: MORTGAGE CALCULATION */}
                    {msg.actionResult?.type === "mortgage" && (
                      <div className="mt-3 rounded-xl border border-emerald-500/30 bg-slate-950/80 p-3.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          <Calculator className="h-4 w-4" /> Real Estate Financial Breakdown
                        </div>
                        {(() => {
                          const calc = msg.actionResult.data as MortgageCalculation;
                          return (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                                <span className="text-slate-400 text-[10px] block">Monthly EMI</span>
                                <span className="text-sm font-bold text-emerald-300">
                                  {currency === "USD" ? `$${calc.monthlyEMI.toLocaleString()}` : `₹${calc.monthlyEMI.toLocaleString()}`}
                                </span>
                              </div>
                              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                                <span className="text-slate-400 text-[10px] block">Down Payment (20%)</span>
                                <span className="text-sm font-bold text-slate-200">
                                  {currency === "USD" ? `$${calc.downPayment.toLocaleString()}` : `₹${calc.downPayment.toLocaleString()}`}
                                </span>
                              </div>
                              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                                <span className="text-slate-400 text-[10px] block">Annual Rate</span>
                                <span className="text-sm font-bold text-slate-200">{calc.interestRate}% p.a.</span>
                              </div>
                              <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                                <span className="text-slate-400 text-[10px] block">Est. Rental Yield</span>
                                <span className="text-sm font-bold text-teal-300">{calc.estimatedRentalYield}%</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* ACTION RESULT WIDGET: TOUR BOOKING */}
                    {msg.actionResult?.type === "tour" && (
                      <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3">
                        <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Tour Booking Confirmed
                          </span>
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400">
                            Active Pass
                          </span>
                        </div>
                        {(() => {
                          const tour = msg.actionResult.data as TourBooking;
                          return (
                            <div className="text-xs text-slate-300 space-y-1 mt-2">
                              <p><strong className="text-white">Property:</strong> {tour.propertyTitle}</p>
                              <p><strong className="text-white">Time:</strong> {tour.date} at {tour.time}</p>
                              <p><strong className="text-white">Status:</strong> Digital gate entry badge dispatched</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* ACTION RESULT WIDGET: MAINTENANCE TRIAGE */}
                    {msg.actionResult?.type === "maintenance" && (
                      <div className="mt-3 rounded-xl border border-amber-500/30 bg-slate-950/90 p-3.5">
                        {(() => {
                          const triage = msg.actionResult.data as MaintenanceTriageResult;
                          return (
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-bold text-white">
                                  <Wrench className="h-4 w-4 text-amber-400" /> {triage.category} Ticket Dispatched
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    triage.urgency === "CRITICAL"
                                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  }`}
                                >
                                  {triage.urgency} Priority
                                </span>
                              </div>
                              <p className="text-slate-300">{triage.diagnostic}</p>
                              <div className="rounded-lg bg-slate-900 p-2 text-[11px] text-amber-200/90 border border-slate-800">
                                <strong>Safety Action:</strong> {triage.recommendedAction}
                              </div>
                              <p className="text-[10px] text-slate-400">
                                <strong>Turnaround:</strong> {triage.estimatedResolution}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* ACTION RESULT WIDGET: LISTING COPY */}
                    {msg.actionResult?.type === "listing" && (
                      <div className="mt-3 rounded-xl border border-teal-500/30 bg-slate-950/90 p-3.5 space-y-2 text-xs">
                        {(() => {
                          const listing = msg.actionResult.data as ListingDraftResult;
                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                                  <FileText className="h-4 w-4" /> AI Generated Listing Copy
                                </span>
                                <button
                                  onClick={() => handleCopy(`${listing.headline}\n\n${listing.description}`, msg.id)}
                                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                                >
                                  {copiedId === msg.id ? (
                                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  {copiedId === msg.id ? "Copied" : "Copy"}
                                </button>
                              </div>
                              <p className="font-semibold text-white">{listing.headline}</p>
                              <p className="text-slate-300 text-[11px] leading-relaxed">{listing.description}</p>
                              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-300">
                                {listing.keyFeatures.map((feat, i) => (
                                  <li key={i}>{feat}</li>
                                ))}
                              </ul>
                              <div className="pt-1 text-[11px] text-teal-400 font-medium">
                                Target Range: {listing.suggestedPriceRange}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* ACTION RESULT WIDGET: LEASE CLAUSE ANALYSIS */}
                    {msg.actionResult?.type === "clause" && (
                      <div className="mt-3 rounded-xl border border-indigo-500/30 bg-slate-950/90 p-3.5 space-y-2 text-xs">
                        {(() => {
                          const clause = msg.actionResult.data as ClauseAnalysisResult;
                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                                  <ShieldCheck className="h-4 w-4" /> Lease Clause Legal Audit
                                </span>
                                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                  {clause.riskLevel} Risk
                                </span>
                              </div>
                              <p className="font-semibold text-white">{clause.clauseSummary}</p>
                              <div className="text-slate-300 text-[11px]">
                                <strong>Advice:</strong> {clause.keyAdvice}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <span className="mt-1 text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {/* Thinking Indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 p-2">
                  <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>EstateIQ agent reasoning & executing tools...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-800/80 p-4 bg-slate-950/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-2 focus-within:border-emerald-500/60 transition"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={config.placeholder}
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}