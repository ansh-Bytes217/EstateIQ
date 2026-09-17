import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MOCK_PROPERTIES, MOCK_AGENTS } from "../data/mockData";
import { formatPrice } from "../lib/utils";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  CalendarClock,
  Phone,
  MessageCircle,
  Heart,
  Share,
  ChevronLeft,
  Calendar,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check,
  Building,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { ZestimateCard } from "../components/zillow/ZestimateCard";
import { MonthlyPaymentCalculator } from "../components/zillow/MonthlyPaymentCalculator";
import { NeighborhoodInsights } from "../components/zillow/NeighborhoodInsights";
import { PriceTaxHistory } from "../components/zillow/PriceTaxHistory";
import { ScheduleTourModal } from "../components/zillow/ScheduleTourModal";
import { PropertyGalleryModal } from "../components/zillow/PropertyGalleryModal";
import { SimilarHomes } from "../components/zillow/SimilarHomes";

export const PropertyDetails = () => {
  const { id } = useParams();
  const {
    currency,
    savedPropertyIds,
    toggleSaved,
    comparePropertyIds,
    toggleCompare,
    setCopilotOpen,
    setCopilotMode,
  } = useStore();

  const property = MOCK_PROPERTIES.find((p) => p.id === id) || MOCK_PROPERTIES[0];
  const agent = MOCK_AGENTS.find((a) => a.id === property.agentId) || MOCK_AGENTS[0];

  const isSaved = savedPropertyIds.includes(property.id);
  const isComparing = comparePropertyIds.includes(property.id);

  // Modal states
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"photos" | "floorplan">("photos");
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  const handleOpenGallery = (index = 0, tab: "photos" | "floorplan" = "photos") => {
    setGalleryInitialIndex(index);
    setGalleryTab(tab);
    setIsGalleryOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  const handleAskCopilot = () => {
    setCopilotMode("buy");
    setCopilotOpen(true);
  };

  const estimatedMonthly = Math.round(property.price * 0.0075);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Sub-Header Navigation */}
      <div className="border-b border-slate-200 bg-white sticky top-16 z-30 shadow-xs">
        <div className="container mx-auto px-4 max-w-7xl h-12 flex items-center justify-between text-xs font-semibold text-slate-600">
          <Link
            to="/search"
            className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Search
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#overview" className="hover:text-emerald-700 transition">Overview</a>
            <a href="#zestimate" className="hover:text-emerald-700 transition">EstateEstimate®</a>
            <a href="#payment-calculator" className="hover:text-emerald-700 transition">Monthly Cost</a>
            <a href="#features" className="hover:text-emerald-700 transition">Features</a>
            <a href="#neighborhood" className="hover:text-emerald-700 transition">Schools & Neighborhood</a>
            <a href="#price-history" className="hover:text-emerald-700 transition">Price & Taxes</a>
            <a href="#similar-homes" className="hover:text-emerald-700 transition">Similar Homes</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(property.id)}
              className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition ${
                isComparing
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              {isComparing ? "Comparing" : "Compare"}
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition"
            >
              {shareCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share className="h-3.5 w-3.5" />}
              {shareCopied ? "Link Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Title & Key Specs Bar */}
      <div id="overview" className="container mx-auto px-4 max-w-7xl pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                {property.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {property.type}
              </span>
              {property.featured && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Featured Listing
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{property.location.locality}, {property.location.city}</span>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2 shrink-0">
            <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {formatPrice(property.price, currency)}
              {property.status === "For Rent" && (
                <span className="text-lg text-slate-500 font-normal"> / month</span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Est. Payment: <span className="font-bold text-slate-800">{formatPrice(estimatedMonthly, currency)}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid with Fullscreen Triggers */}
      <div className="container mx-auto px-4 max-w-7xl mb-8">
        <div className="relative grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[320px] md:h-[480px] rounded-3xl overflow-hidden bg-slate-200 shadow-sm">
          {/* Main Hero Photo */}
          <div
            onClick={() => handleOpenGallery(0, "photos")}
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden"
          >
            <img
              src={property.images[0]}
              alt="Hero"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>

          {/* Secondary Photos */}
          {property.images.slice(1, 4).map((img, i) => (
            <div
              key={i}
              onClick={() => handleOpenGallery(i + 1, "photos")}
              className="hidden md:block relative group cursor-pointer overflow-hidden"
            >
              <img
                src={img}
                alt={`Photo ${i + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
          ))}

          {/* Overlay Buttons on Gallery */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
            {property.floorPlanImage && (
              <button
                onClick={() => handleOpenGallery(0, "floorplan")}
                className="bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition"
              >
                <Layers className="h-4 w-4 text-emerald-600" /> Floor Plan
              </button>
            )}
            <button
              onClick={() => handleOpenGallery(0, "photos")}
              className="bg-slate-900/90 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition"
            >
              <ImageIcon className="h-4 w-4" /> View all {property.images.length} photos
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left 2/3 and Sticky Right 1/3 Sidebar */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT 2/3 COLUMN: Modules */}
          <div className="lg:w-2/3 space-y-8">
            {/* Quick Specs Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <BedDouble className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{property.specs.beds}</div>
                  <div className="text-xs text-slate-500 font-medium">Bedrooms</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Bath className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{property.specs.baths}</div>
                  <div className="text-xs text-slate-500 font-medium">Bathrooms</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Square className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{property.specs.area.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 font-medium">Square Feet</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 truncate">{property.specs.furnishing}</div>
                  <div className="text-xs text-slate-500 font-medium">Furnishing Status</div>
                </div>
              </div>
            </div>

            {/* 1. Zestimate (EstateEstimate) */}
            <ZestimateCard property={property} />

            {/* 2. Monthly Payment Affordability Calculator */}
            <MonthlyPaymentCalculator property={property} />

            {/* 3. Description & Features */}
            <section id="features" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-950 tracking-tight">Overview & Property Details</h2>
              <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-3">
                <p>
                  Experience bespoke living in this commanding {property.type.toLowerCase()} located within the prestigious {property.location.locality} corridor in {property.location.city}.
                  This residence offers {property.specs.area.toLocaleString()} sqft of interior space, featuring {property.specs.beds} master suites and {property.specs.baths} designer bathrooms.
                </p>
                <p>
                  Engineered with premium acoustic treatments, oversized floor-to-ceiling double-glazed windows, and European fixtures throughout, this home comes {property.specs.furnishing.toLowerCase()} and move-in ready.
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Amenities & Building Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium p-2 rounded-lg bg-slate-50/80">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Schools & Neighborhood Intelligence */}
            <NeighborhoodInsights property={property} />

            {/* 5. Price & Tax History */}
            <PriceTaxHistory property={property} />

            {/* 6. Similar Homes */}
            <SimilarHomes currentProperty={property} />
          </div>

          {/* RIGHT 1/3 STICKY SIDEBAR: Zillow "Request a Tour" Widget */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 space-y-6">
              {/* Tour Booking & Action Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tour this home
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 mt-1">
                    Request a Private Tour
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Guided by an authorized local specialist. In-person or live video available.
                  </p>
                </div>

                {/* Direct Big Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsTourModalOpen(true)}
                    className="w-full py-4 text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" /> Request a Tour
                  </Button>

                  <Button
                    onClick={handleAskCopilot}
                    variant="outline"
                    className="w-full py-3.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-600" /> Ask Copilot About This Home
                  </Button>
                </div>

                {/* Save to Wishlist Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleSaved(property.id)}
                    className={`flex items-center gap-2 text-xs font-bold transition ${
                      isSaved ? "text-rose-600" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
                    {isSaved ? "Saved to Wishlist" : "Save Property"}
                  </button>

                  <span className="text-[11px] text-slate-400">MLS ID: #EST-{property.id.toUpperCase()}</span>
                </div>

                {/* Premier Agent Contact Card */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Premier Listing Agent
                    </span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      ★ {agent.rating} (48 reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-base">{agent.name}</div>
                      <div className="text-xs text-slate-500 font-medium">EstateIQ Premier Partner</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${agent.phone}`}
                      className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call Agent
                    </a>
                    <a
                      href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1fb355] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Zero Spam Guarantee */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">EstateIQ Buyer Guarantee</div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">
                    Your contact information is strictly protected. We never sell your data or allow unsolicited contractor calls.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <ScheduleTourModal
        property={property}
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
      />

      <PropertyGalleryModal
        property={property}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryInitialIndex}
        initialTab={galleryTab}
      />
    </div>
  );
};
