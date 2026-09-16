import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import {
  Building,
  DollarSign,
  Users,
  Wrench,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Calendar,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export const LandlordDashboard: React.FC = () => {
  const {
    currency,
    tenancies,
    updateRentPaymentStatus,
    maintenanceTickets,
    updateTicketStatus,
    setCopilotOpen,
    setCopilotMode,
  } = useStore();

  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  const totalMonthlyRent = tenancies.reduce((acc, curr) => acc + curr.monthlyRent, 0);
  const paidCount = tenancies.filter((t) => t.paymentStatus === "PAID").length;
  const openTickets = maintenanceTickets.filter((t) => t.status !== "RESOLVED");

  const handleSendReminder = (id: string, tenantName: string) => {
    setReminderSentId(id);
    setTimeout(() => setReminderSentId(null), 3000);
  };

  const handleTriggerAI = () => {
    setCopilotMode("sell");
    setCopilotOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Landlord Asset Portfolio
            </h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 border border-emerald-200">
              Enterprise Portal
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time occupancy, automated rent collection tracking, and AI-triaged maintenance operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleTriggerAI}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-700 hover:to-teal-700"
          >
            <Sparkles className="h-4 w-4" />
            AI Portfolio Advisor
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +8.4% YoY
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Monthly Rent Inflow</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {currency === "USD"
                  ? `$${Math.round(totalMonthlyRent / 83).toLocaleString()}`
                  : `₹${totalMonthlyRent.toLocaleString()}`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {paidCount} of {tenancies.length} units collected this cycle
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Building className="h-6 w-6" />
              </div>
              <span className="flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                100% Leased
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Occupancy Rate</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">96.8%</h3>
              <p className="text-xs text-slate-400 mt-1">Average lease tenure: 2.3 years</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Wrench className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                {openTickets.length} Active
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Maintenance Triage</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {openTickets.length} Tickets
              </h3>
              <p className="text-xs text-slate-400 mt-1">Avg response time: 1.8 hrs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-full">
                Top Decile
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Net Rental Yield</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">6.2%</h3>
              <p className="text-xs text-slate-400 mt-1">+1.4% above city benchmark</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenancy & Rent Collection Ledger */}
      <Card className="border-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Active Tenancies & Rent Ledger
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Live automated rent status tracking with 1-click AI reminder dispatch
            </p>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Property & Unit</th>
                <th className="px-6 py-3.5">Tenant Details</th>
                <th className="px-6 py-3.5">Monthly Rent</th>
                <th className="px-6 py-3.5">Lease Expiry</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tenancies.map((ten) => (
                <tr key={ten.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    <div>{ten.propertyTitle}</div>
                    <span className="text-xs font-normal text-slate-500">{ten.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{ten.tenantName}</div>
                    <span className="text-xs text-slate-400">{ten.tenantEmail}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {currency === "USD"
                      ? `$${Math.round(ten.monthlyRent / 83).toLocaleString()}`
                      : `₹${ten.monthlyRent.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {ten.leaseEnd}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {ten.paymentStatus === "PAID" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Paid
                      </span>
                    )}
                    {ten.paymentStatus === "PENDING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        <Clock className="h-3.5 w-3.5 text-amber-600" /> Pending
                      </span>
                    )}
                    {ten.paymentStatus === "OVERDUE" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-600" /> Overdue
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {ten.paymentStatus === "PAID" ? (
                      <button
                        onClick={() => updateRentPaymentStatus(ten.id, "PENDING")}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Reset Status
                      </button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendReminder(ten.id, ten.tenantName)}
                        disabled={reminderSentId === ten.id}
                        className="text-xs font-medium border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        {reminderSentId === ten.id ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Reminder Sent!
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3 mr-1" /> Send AI Reminder
                          </>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Maintenance Triage Board */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-slate-900">
                AI Maintenance Triage Board
              </CardTitle>
              <span className="rounded bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5">
                Auto-Classified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Urgency scoring and contractor scheduling powered by EstateIQ diagnostic algorithms
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {maintenanceTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {ticket.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        ticket.urgency === "CRITICAL"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : ticket.urgency === "HIGH"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {ticket.urgency}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 text-sm mt-2">{ticket.propertyTitle}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ticket.issue}</p>

                  {ticket.aiDiagnostic && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600 border border-slate-100">
                      <strong className="text-slate-800 block mb-0.5">AI Diagnostic:</strong>
                      {ticket.aiDiagnostic}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Status: <strong className="text-slate-700">{ticket.status}</strong>
                  </span>
                  {ticket.status !== "RESOLVED" ? (
                    <button
                      onClick={() => updateTicketStatus(ticket.id, "RESOLVED")}
                      className="font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Closed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
