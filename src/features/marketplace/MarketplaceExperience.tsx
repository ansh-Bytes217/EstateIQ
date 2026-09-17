import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  ChevronDown,
  Heart,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { MOCK_PROPERTIES } from "../../data/mockData";
import { formatPrice } from "../../lib/utils";
import { useStore } from "../../store/useStore";
import type { Property } from "../../types";

const intents = ["Buy", "Rent", "Commercial"] as const;
type Intent = (typeof intents)[number];

function ListingCard({ property, index }: { property: Property; index: number }) {
  const { currency, savedPropertyIds, toggleSaved } = useStore();
  const saved = savedPropertyIds.includes(property.id);
  return (
    <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between"><span className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">{property.status}</span><button onClick={() => toggleSaved(property.id)} aria-label={saved ? "Remove saved property" : "Save property"} className="rounded-full bg-white/90 p-2 text-slate-600 shadow-sm backdrop-blur hover:text-rose-500"><Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} /></button></div>
        <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/75 px-2 py-1 text-[11px] font-semibold text-white">{property.type}</div>
      </div>
      <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="line-clamp-1 font-bold text-slate-900">{property.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{property.location.locality}, {property.location.city}</p></div><span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700"><Sparkles className="h-3 w-3" />{94 - index * 5}%</span></div><p className="mt-4 text-xl font-extrabold text-slate-950">{formatPrice(property.price, currency)}{property.status === "For Rent" && <span className="text-xs font-medium text-slate-500"> / month</span>}</p><div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500"><span>{property.specs.beds} Beds</span><span>{property.specs.baths} Baths</span><span>{property.specs.area} sqft</span></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"><MessageCircle className="h-4 w-4" /> Chat about this property</button></div>
    </motion.article>
  );
}

export function MarketplaceExperience() {
  const [intent, setIntent] = useState<Intent>("Buy");
  const [location, setLocation] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");
  const filteredProperties = useMemo(() => {
    const normalized = location.trim().toLowerCase();
    return MOCK_PROPERTIES.filter((property) => {
      const matchesLocation = !normalized || `${property.location.city} ${property.location.locality} ${property.title}`.toLowerCase().includes(normalized);
      const matchesIntent = intent === "Buy" ? property.status === "For Sale" : intent === "Rent" ? property.status === "For Rent" : property.type === "Commercial";
      return matchesLocation && matchesIntent;
    });
  }, [intent, location]);

  return <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 lg:px-8"><a href="/" className="flex items-center gap-2 text-emerald-700"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white"><Building2 className="h-5 w-5" /></span><span className="text-xl font-extrabold tracking-tight text-slate-950">EstateIQ</span></a><nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex"><button className="text-emerald-700">Buy</button><button className="hover:text-emerald-700">Rent</button><button className="hover:text-emerald-700">Commercial</button><button className="hover:text-emerald-700">New Projects</button></nav><div className="ml-auto flex items-center gap-2"><button aria-label="Notifications" className="hidden rounded-full p-2 text-slate-500 hover:bg-slate-100 sm:block"><Bell className="h-5 w-5" /></button><button className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold sm:flex"><UserRound className="h-4 w-4" />Sign in<ChevronDown className="h-4 w-4" /></button><button className="rounded-lg p-2 text-slate-600 lg:hidden" aria-label="Menu"><Menu className="h-5 w-5" /></button></div></div><div className="border-t border-slate-100"><div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-2 text-xs font-semibold text-slate-500 lg:px-8"><span>Popular searches</span><button className="whitespace-nowrap hover:text-emerald-700">Flats in Bangalore</button><button className="whitespace-nowrap hover:text-emerald-700">Rent in Mumbai</button><button className="whitespace-nowrap hover:text-emerald-700">Plots in Hyderabad</button><button className="whitespace-nowrap hover:text-emerald-700">Luxury homes</button></div></div></header>
    <main>
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 pb-8 pt-10 lg:px-8 lg:pt-14"><div className="max-w-3xl"><p className="text-sm font-bold text-emerald-700">India's intelligent property search</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Find a place that feels like yours.</h1><p className="mt-3 text-base text-slate-500">Search verified homes, apartments, plots, and commercial spaces with an AI match score built into every result.</p></div><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60"><div className="flex items-center gap-1 border-b border-slate-100 px-2">{intents.map((item) => <button key={item} onClick={() => setIntent(item)} className={`border-b-2 px-4 py-3 text-sm font-bold ${intent === item ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500"}`}>{item}</button>)}<button onClick={() => setFiltersOpen(!filtersOpen)} className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"><SlidersHorizontal className="h-4 w-4" /> Filters</button></div><div className="grid gap-2 p-2 md:grid-cols-[1.5fr_1fr_1fr_auto]"><label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"><MapPin className="h-5 w-5 text-emerald-600" /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Search by city, locality, project" className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400" /></label><select className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 outline-none"><option>Budget</option><option>Under ₹50L</option><option>₹50L - ₹1Cr</option><option>₹1Cr - ₹3Cr</option></select><select className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 outline-none"><option>Property type</option><option>Apartment</option><option>Villa</option><option>Plot</option></select><button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700"><Search className="h-4 w-4" /> Search</button></div>{filtersOpen && <div className="flex flex-wrap gap-2 border-t border-slate-100 px-2 pt-3"><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Ready to move</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Verified listings</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">Owner properties</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">3+ bedrooms</span></div>}</div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Recommended for you</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">{filteredProperties.length} properties in your search</h2></div><div className="flex items-center gap-2"><span className="text-xs font-semibold text-slate-500">Sort by</span><select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none"><option>Relevance</option><option>Newest first</option><option>Price: low to high</option></select><button onClick={() => setView(view === "grid" ? "map" : "grid")} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"><Map className="h-4 w-4" /> {view === "grid" ? "Map view" : "Grid view"}</button></div></div>{view === "grid" ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredProperties.map((property, index) => <ListingCard key={property.id} property={property} index={index} />)}</div> : <div className="mt-6 grid min-h-[560px] gap-5 lg:grid-cols-[0.9fr_1.1fr]"><div className="order-2 grid gap-4 overflow-auto sm:grid-cols-2 lg:order-1 lg:grid-cols-1">{filteredProperties.map((property, index) => <ListingCard key={property.id} property={property} index={index} />)}</div><div className="relative order-1 min-h-[460px] overflow-hidden rounded-2xl border border-slate-200 bg-[#e4ece6] lg:order-2" style={{ backgroundImage: "linear-gradient(30deg, transparent 45%, rgba(71,85,105,.15) 46%, transparent 47%), linear-gradient(120deg, transparent 45%, rgba(71,85,105,.12) 46%, transparent 47%), linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)", backgroundSize: "180px 130px, 220px 180px, 42px 42px, 42px 42px" }}>{filteredProperties.map((property, index) => <button key={property.id} className="absolute rounded-full border-2 border-white bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-lg" style={{ left: `${18 + index * 18}%`, top: `${24 + (index % 3) * 23}%` }}>{property.price}</button>)}</div></div>}{filteredProperties.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-bold">No properties match this search</p><p className="mt-2 text-sm text-slate-500">Try another city or broaden your filters.</p></div>}</section>
    </main>
    <button className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl"><Sparkles className="h-4 w-4 text-emerald-300" />Ask AI about this search</button>
  </div>;
}
