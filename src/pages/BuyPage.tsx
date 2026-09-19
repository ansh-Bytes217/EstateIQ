import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_PROPERTIES } from "../data/mockData";
import { formatPrice } from "../lib/utils";

const categories = [
  { title: "Popular choices", links: [["Ready to move", "/search?filter=ready"], ["Owner properties", "/search?filter=owner"], ["Budget homes", "/search?budget=under-50-lac"], ["New projects", "/search?filter=new"]] },
  { title: "Property types", links: [["Flats", "/search?type=Apartment&status=For+Sale"], ["Villas", "/search?type=Villa&status=For+Sale"], ["Plots", "/search?type=Plot&status=For+Sale"], ["Office spaces", "/search?type=Commercial&status=For+Sale"]] },
  { title: "Budget", links: [["Under ₹50 Lac", "/search?budget=under-50-lac"], ["₹50 Lac - ₹1 Cr", "/search?budget=50-lac-1-cr"], ["₹1 Cr - ₹1.5 Cr", "/search?budget=1-1.5-cr"], ["Above ₹1.5 Cr", "/search?budget=above-1.5-cr"]] },
  { title: "Explore", links: [["Localities", "/search?view=localities"], ["Projects", "/search?view=projects"], ["Find an agent", "/search?view=agents"], ["Property guides", "/insights"]] },
] as const;

export function BuyPage() {
  const featured = MOCK_PROPERTIES.filter((property) => property.status === "For Sale").slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      <section className="bg-[#101e31] px-5 py-16 text-white lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Buy with confidence</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">Find a home that fits your next chapter.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Search verified homes, compare neighborhoods, and make your shortlist with better market context.</p>
          <form action="/search" className="mt-10 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 text-slate-900 sm:flex-row">
            <input type="hidden" name="status" value="For Sale" />
            <label className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"><Search className="h-5 w-5 text-emerald-600" /><input name="city" placeholder="Search city, locality or project" className="w-full bg-transparent text-sm outline-none" /></label>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white hover:bg-emerald-700">Search homes <ArrowRight className="h-4 w-4" /></button>
          </form>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => <div key={category.title} className="border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-bold text-slate-950">{category.title}</h2><div className="mt-5 space-y-3 text-sm text-slate-600">{category.links.map(([label, to]) => <Link key={label} to={to} className="block hover:text-emerald-700">{label}</Link>)}</div></div>)}
        </div>
        <div className="mt-16 flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Featured for sale</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight">Homes worth a closer look.</h2></div><Link to="/search?status=For+Sale" className="hidden items-center gap-2 text-sm font-bold text-emerald-700 sm:flex">See all homes <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">{featured.map((property) => <Link key={property.id} to={`/properties/${property.id}`} className="group overflow-hidden border border-slate-200 bg-white shadow-sm"><img src={property.images[0]} alt={property.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /><div className="p-5"><p className="text-lg font-extrabold">{formatPrice(property.price, "INR")}</p><h3 className="mt-2 font-bold">{property.title}</h3><p className="mt-1 text-sm text-slate-500">{property.location.locality}, {property.location.city}</p><p className="mt-4 text-xs font-semibold text-slate-500">{property.specs.beds} beds · {property.specs.baths} baths · {property.specs.area} sqft</p></div></Link>)}</div>
      </section>
    </div>
  );
}