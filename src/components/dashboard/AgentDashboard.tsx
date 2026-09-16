import React, { useState } from "react";
import { useStore } from "../../store/useStore";
import {
  Users,
  Eye,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Clock,
  Sparkles,
  Send,
  Plus,
  CheckCircle2,
  X,
  FileText,
  Copy,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";

export const AgentDashboard: React.FC = () => {
  const {
    leads,
    updateLeadStatus,
    tourBookings,
    setCopilotOpen,
    setCopilotMode,
    currency,
  } = useStore();

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>("l-301");
  const [replyDraft, setReplyDraft] = useState<string>("");
  const [replySent, setReplySent] = useState(false);

  // Listing Creator Modal state
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingForm, setListingForm] = useState({
    title: "",
    type: "Apartment",
    city: "Mumbai",
    price: "35000000",
    beds: "3",
    baths: "3",
    area: "2400",
    amenities: "Sea View, Infinity Pool, Smart Home, Concierge",
  });
  const [generatedCopy, setGeneratedCopy] = useState<{
    headline: string;
    description: string;
    bulletPoints: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const handleSelectLead = (id: string) => {
    setSelectedLeadId(id);
    const target = leads.find((l) => l.id === id);
    if (target) setReplyDraft(target.aiSuggestedReply);
  };

  const handleSendReply = () => {
    if (selectedLead) {
      updateLeadStatus(selectedLead.id, "CONTACTED");
      setReplySent(true);
      setTimeout(() => setReplySent(false), 3000);
    }
  };

  const handleGenerateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCopy({
        headline: `Ultra-Luxury ${listingForm.beds}-BHK ${listingForm.type} in Prime ${listingForm.city}`,
        description: `Indulge in unmatched elegance and contemporary prestige. Spanning ${listingForm.area} sqft of meticulously engineered living spaces, this exclusive residence boasts panoramic horizon views, Italian marble interiors, and state-of-the-art smart automation. Perfect for discerning homeowners seeking both lifestyle prestige and sound capital appreciation.`,
        bulletPoints: [
          `Expansive ${listingForm.area} sqft sun-drenched open-concept layout with private viewing terrace`,
          `Chef-grade modular kitchen with integrated premium appliances and quartz bar`,
          `Pre-installed EV dual parking slots and private biometric elevator access`,
          `Exclusive society amenities: ${listingForm.amenities}`,
        ],
      });
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Agent Command Center
            </h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 border border-emerald-200">
              Sarah Jenkins • Top Producer
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Pipeline acceleration, AI lead qualification, and automated listing generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setCopilotMode("insights");
              setCopilotOpen(true);
            }}
            variant="outline"
            className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            <Sparkles className="h-4 w-4" /> Agent Copilot
          </Button>

          <Button
            onClick={() => setIsListingModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create AI Listing
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Active Pipeline", value: "24 Units", icon: TrendingUp, trend: "+12% MoM", sub: "₹42.5 Cr Total GMV" },
          { title: "Monthly Engagements", value: "8,432", icon: Eye, trend: "+5.4% YoY", sub: "98.2% Search CTR" },
          { title: "Qualified Inquiries", value: `${leads.length} Inquiries`, icon: Users, trend: "+4 this week", sub: "AI Lead Match Score 84%" },
          { title: "Scheduled Viewings", value: `${tourBookings.length} Tours`, icon: Calendar, trend: "Calendar synced", sub: "Next tour in 2h" },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-200/80 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{stat.title}</div>
              <div className="text-[11px] text-slate-400 mt-1">{stat.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Lead Qualification & Auto-Drafting Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads List */}
        <Card className="lg:col-span-5 border-slate-200/80 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-base font-bold text-slate-900">
                AI Lead Qualification Pipeline
              </CardTitle>
            </div>
            <span className="text-xs text-slate-500 font-medium">Ranked by Intent</span>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleSelectLead(lead.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedLeadId === lead.id
                    ? "border-emerald-600 bg-emerald-50/40 shadow-xs"
                    : "border-slate-200/80 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-bold text-sm text-slate-900">{lead.clientName}</div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lead.tier === "HOT"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {lead.tier} ({lead.score}% Match)
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-600 font-medium">{lead.propertyTitle}</div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{lead.message}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{lead.timestamp}</span>
                  <span className="font-semibold text-emerald-700">{lead.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Follow-Up Drafter Panel */}
        <Card className="lg:col-span-7 border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  AI Lead Responder & Negotiation Copilot
                </CardTitle>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Auto-Synthesized
              </span>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {selectedLead ? (
                <>
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Inquiry from: <strong>{selectedLead.clientName}</strong> ({selectedLead.phone})</span>
                      <span>{selectedLead.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium italic">"{selectedLead.message}"</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      EstateIQ Suggested High-Conversion Reply:
                    </label>
                    <textarea
                      rows={5}
                      value={replyDraft || selectedLead.aiSuggestedReply}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-900 leading-relaxed focus:border-emerald-500 focus:outline-none bg-white"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm">Select a lead to review AI drafts</div>
              )}
            </CardContent>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Personalized with MLS comparables & listing highlights
            </span>
            <div className="flex items-center gap-2">
              {replySent && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Sent to Client!
                </span>
              )}
              <Button
                onClick={handleSendReply}
                disabled={replySent}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" /> Dispatch Reply
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Viewings & Showings Schedule */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Confirmed Tour Schedule & Access Passes
            </CardTitle>
          </div>
          <span className="text-xs text-slate-500">Auto-synced with Copilot</span>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tourBookings.map((tour) => (
              <div
                key={tour.id}
                className="rounded-2xl border border-slate-200 p-5 bg-white shadow-xs hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {tour.status}
                  </span>
                  <span className="text-slate-400">{tour.date} • {tour.time}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{tour.propertyTitle}</h4>
                <p className="text-xs text-slate-600 mt-1">Client: <strong>{tour.buyerName}</strong></p>
                {tour.buyerContact && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Contact: {tour.buyerContact}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Listing Creator Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">AI Listing Marketing Engine</h3>
                  <p className="text-xs text-slate-500">Draft high-converting MLS descriptions in seconds</p>
                </div>
              </div>
              <button
                onClick={() => setIsListingModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateListing} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={listingForm.type}
                    onChange={(e) => setListingForm({ ...listingForm, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option>Apartment</option>
                    <option>Penthouse</option>
                    <option>Villa</option>
                    <option>Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / Locality</label>
                  <input
                    type="text"
                    value={listingForm.city}
                    onChange={(e) => setListingForm({ ...listingForm, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={listingForm.beds}
                    onChange={(e) => setListingForm({ ...listingForm, beds: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={listingForm.baths}
                    onChange={(e) => setListingForm({ ...listingForm, baths: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area (sqft)</label>
                  <input
                    type="number"
                    value={listingForm.area}
                    onChange={(e) => setListingForm({ ...listingForm, area: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Amenities / Selling Points</label>
                <input
                  type="text"
                  value={listingForm.amenities}
                  onChange={(e) => setListingForm({ ...listingForm, amenities: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs py-3 rounded-xl shadow-md"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" /> Synthesizing AI Listing Description...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Generate Professional Marketing Copy
                  </span>
                )}
              </Button>
            </form>

            {/* Generated Copy Preview */}
            {generatedCopy && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                    AI Listing Copy Ready
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${generatedCopy.headline}\n\n${generatedCopy.description}\n\n${generatedCopy.bulletPoints.join("\n")}`
                      );
                      alert("Copied to clipboard!");
                    }}
                    className="flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:text-emerald-800"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Text
                  </button>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{generatedCopy.headline}</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{generatedCopy.description}</p>
                <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                  {generatedCopy.bulletPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
