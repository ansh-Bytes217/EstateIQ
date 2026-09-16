import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import {
  Home,
  CreditCard,
  Wrench,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertCircle,
  Calendar,
  PhoneCall,
  ShieldCheck,
  Send,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";

export const TenantDashboard: React.FC = () => {
  const {
    currency,
    maintenanceTickets,
    addMaintenanceTicket,
    setCopilotOpen,
    setCopilotMode,
  } = useStore();

  const [issueCategory, setIssueCategory] = useState<"Plumbing" | "Electrical" | "HVAC" | "Appliance" | "General">("Plumbing");
  const [issueText, setIssueText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToast, setSubmittedToast] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const activeLease = {
    propertyTitle: "Modern Minimalist Apartment",
    unit: "Unit 402, South Extension",
    monthlyRent: 85000,
    nextDueDate: "October 1st, 2026",
    daysRemaining: 14,
    deposit: 255000,
    landlordName: "Sarah Jenkins (Managing Agent)",
    landlordPhone: "+91 98765 43210",
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      let urgency: "CRITICAL" | "HIGH" | "ROUTINE" = "ROUTINE";
      const lower = issueText.toLowerCase();
      if (lower.includes("flood") || lower.includes("spark") || lower.includes("smoke")) urgency = "CRITICAL";
      else if (lower.includes("leak") || lower.includes("broken") || lower.includes("ac")) urgency = "HIGH";

      addMaintenanceTicket({
        propertyTitle: activeLease.propertyTitle,
        tenantName: "Aarav Sharma",
        category: issueCategory,
        issue: issueText,
        urgency,
        estimatedResolution: urgency === "CRITICAL" ? "Under 2 hours" : "Within 24 hours",
        aiDiagnostic: "Automated symptom match completed. Work order dispatched to certified building contractor.",
      });

      setIssueText("");
      setIsSubmitting(false);
      setSubmittedToast(true);
      setTimeout(() => setSubmittedToast(false), 4000);
    }, 600);
  };

  const handleSimulatePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 5000);
  };

  const handleAskAI = (prompt: string) => {
    setCopilotMode("rent");
    setCopilotOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Tenant Resident Portal
            </h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 border border-emerald-200">
              Active Tenancy
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage your lease, simulate rent payments, and access AI-powered maintenance diagnostics.
          </p>
        </div>

        <Button
          onClick={() => handleAskAI("Explain my lease terms")}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-700 hover:to-teal-700"
        >
          <Sparkles className="h-4 w-4" />
          AI Tenant Concierge
        </Button>
      </div>

      {/* Active Lease & Quick Payment Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/80 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg font-bold text-slate-900">My Active Lease</CardTitle>
            </div>
            <span className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1">
              Verified Tenancy
            </span>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Property</p>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{activeLease.propertyTitle}</h3>
                <p className="text-sm text-slate-500">{activeLease.unit}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-3.5 w-3.5 text-slate-400" />
                    <span>Managing Agent: <strong>{activeLease.landlordName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Security Deposit in Escrow: <strong>{currency === "USD" ? "$3,072" : "₹2,55,000"}</strong></span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Next Rent Due ({activeLease.nextDueDate})
                  </span>
                  <div className="text-3xl font-bold mt-1 text-white">
                    {currency === "USD"
                      ? `$${Math.round(activeLease.monthlyRent / 83).toLocaleString()}`
                      : `₹${activeLease.monthlyRent.toLocaleString()}`}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Due in {activeLease.daysRemaining} days</p>
                </div>

                <div className="mt-4">
                  {paymentSuccess ? (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 p-2.5 text-xs text-emerald-300 font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Payment Processed! Receipt Dispatched.
                    </div>
                  ) : (
                    <button
                      onClick={handleSimulatePayment}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-md hover:from-emerald-400 hover:to-teal-300 transition"
                    >
                      <CreditCard className="h-4 w-4" /> Pay Rent Online
                    </button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Quick Advice */}
        <Card className="border-slate-200/80 shadow-sm bg-gradient-to-b from-white to-slate-50">
          <CardHeader className="py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base font-bold text-slate-900">Tenant AI Shortcuts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-2.5">
            {[
              "Review my 60-day lease renewal clause",
              "Can I sublet or host a guest for 2 weeks?",
              "Emergency water shutoff valve location",
              "Request parking decal for new vehicle",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleAskAI(prompt)}
                className="w-full text-left text-xs text-slate-700 bg-white border border-slate-200/80 rounded-xl p-3 hover:border-emerald-500/50 hover:bg-emerald-50/50 transition flex items-center justify-between group"
              >
                <span>{prompt}</span>
                <Sparkles className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-600 transition" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Request Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Ticket Form */}
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                Submit Maintenance Request
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Issue Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Plumbing", "Electrical", "HVAC", "Appliance", "General"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setIssueCategory(cat)}
                      className={`rounded-xl border py-2 text-xs font-medium transition ${
                        issueCategory === cat
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Describe Problem
                </label>
                <textarea
                  rows={3}
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder="E.g. Sink is dripping and water pooling inside the cabinet..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {submittedToast && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Ticket triaged with AI priority and dispatched to building management!</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={!issueText.trim() || isSubmitting}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-2.5 rounded-xl"
              >
                {isSubmitting ? "Running AI Diagnostic..." : "Dispatch Ticket with AI Diagnostic"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Live Maintenance Tickets */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
            <CardTitle className="text-base font-bold text-slate-900">
              Active Service Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {maintenanceTickets.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-xl border border-slate-200/80 p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{ticket.category}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        ticket.urgency === "CRITICAL"
                          ? "bg-rose-100 text-rose-800"
                          : ticket.urgency === "HIGH"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {ticket.urgency}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{ticket.issue}</p>
                  {ticket.aiDiagnostic && (
                    <p className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      AI Note: {ticket.aiDiagnostic}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs text-slate-400 gap-1">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <Clock className="h-3 w-3" /> {ticket.status}
                  </span>
                  <span className="text-[10px]">ETA: {ticket.estimatedResolution}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Digital Document Vault */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Digital Document Vault
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Registered Lease Agreement.pdf", size: "2.4 MB", date: "April 2024" },
              { name: "Pre-Tenancy Condition Report.pdf", size: "8.1 MB", date: "April 2024" },
              { name: "Building Society Bylaws & Parking.pdf", size: "1.2 MB", date: "April 2024" },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{doc.size} • {doc.date}</p>
                </div>
                <button
                  onClick={() => alert(`Simulated download: ${doc.name}`)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900 transition shadow-xs"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
