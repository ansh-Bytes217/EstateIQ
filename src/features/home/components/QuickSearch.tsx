import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, MapPin, IndianRupee } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export const QuickSearch = () => {
  const navigate = useNavigate();
  const [intent, setIntent] = useState<"buy" | "rent" | "new">("buy");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [type, setType] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("intent", intent);
    if (location) params.set("city", location);
    if (price) {
      const [min, max] = price.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    if (beds) params.set("beds", beds);
    if (type) params.set("propertyType", type);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-3 md:p-6 mx-auto mt-8">
      {/* Intent Tabs */}
      <div className="flex items-center gap-6 px-2 pb-4 border-b border-slate-100 mb-5">
        {[
          { id: "buy", label: "Buy" },
          { id: "rent", label: "Rent" },
          { id: "new", label: "New Construction" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setIntent(tab.id as any)}
            className={`font-semibold pb-1 border-b-2 transition-colors ${
              intent === tab.id
                ? "text-emerald-600 border-emerald-600"
                : "text-slate-500 hover:text-slate-900 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
        {/* Location */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-500 transition-colors">
          <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Locality, or Landmark..."
            className="w-full bg-transparent outline-none text-slate-900 font-medium placeholder:font-normal"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row gap-4 lg:w-3/5">
          {/* Price */}
          <div className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-500 transition-colors flex items-center gap-2">
             <IndianRupee className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 appearance-none font-medium"
            >
              <option value="">Any Price</option>
              <option value="0-2500000">Under ₹25L</option>
              <option value="2500000-5000000">₹25L - ₹50L</option>
              <option value="5000000-10000000">₹50L - ₹1Cr</option>
              <option value="10000000-20000000">₹1Cr - ₹2Cr</option>
              <option value="20000000-999999999">₹2Cr+</option>
            </select>
          </div>

          {/* Beds */}
          <div className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-500 transition-colors">
            <select
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 appearance-none font-medium"
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
          </div>

          {/* Type */}
          <div className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-500 transition-colors">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 appearance-none font-medium"
            >
              <option value="">Property Type</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">Independent House</option>
              <option value="penthouse">Penthouse</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <Button type="submit" size="lg" className="shrink-0 gap-2 h-auto py-3 lg:w-40 shadow-emerald-600/20 shadow-lg text-base">
          <SearchIcon className="h-5 w-5" /> Search
        </Button>
      </form>
    </div>
  );
};
