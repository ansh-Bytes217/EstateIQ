import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { MOCK_PROPERTIES } from "../data/mockData";
import { PropertyCard } from "../components/shared/PropertyCard";
import {
  Heart,
  Scale,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Building2,
  Calendar,
  Layers,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const SavedProperties: React.FC = () => {
  const {
    savedPropertyIds,
    toggleSaved,
    comparePropertyIds,
    toggleCompare,
    clearCompare,
    currency,
    setCopilotOpen,
    setCopilotMode,
  } = useStore();

  const savedProperties = MOCK_PROPERTIES.filter((p) => savedPropertyIds.includes(p.id));
  const comparedProperties = MOCK_PROPERTIES.filter((p) => comparePropertyIds.includes(p.id));

  const formatPrice = (price: number) => {
    if (currency === "USD") return `$${Math.round(price / 83).toLocaleString()}`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Heart className="h-5 w-5 fill-rose-500" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Saved Properties & Comparison
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Track your favorite properties and evaluate side-by-side metrics with AI scoring.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setCopilotMode("buy");
                setCopilotOpen(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
            >
              <Sparkles className="h-4 w-4" /> Compare with AI Copilot
            </Button>
          </div>
        </div>

        {/* SIDE-BY-SIDE COMPARISON MATRIX */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Side-by-Side Comparison Matrix</h2>
              <span className="text-xs text-slate-400">({comparedProperties.length}/4 selected)</span>
            </div>
            {comparedProperties.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear Matrix
              </button>
            )}
          </div>

          {comparedProperties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white">
              <Layers className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No properties selected for comparison</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Select "Compare" on any property below to see side-by-side pricing, area efficiency, and AI investment ratings.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 w-44 font-semibold text-slate-500 uppercase tracking-wider">Metrics</th>
                    {comparedProperties.map((p) => (
                      <th key={p.id} className="p-4 min-w-[240px] text-slate-900">
                        <div className="relative">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="h-28 w-full rounded-xl object-cover mb-2"
                          />
                          <button
                            onClick={() => toggleCompare(p.id)}
                            aria-label="Remove comparison"
                            className="absolute top-2 right-2 rounded-full bg-slate-950/60 p-1 text-white hover:bg-rose-600 transition"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="font-bold text-sm truncate">{p.title}</div>
                        <div className="text-emerald-700 font-extrabold text-base mt-1">
                          {formatPrice(p.price)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Location</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4 font-medium text-slate-800">
                        {p.location.locality}, {p.location.city}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Property Type</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">{p.type} ({p.status})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Configuration</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4 font-medium text-slate-800">
                        {p.specs.beds} Beds • {p.specs.baths} Baths
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Built-up Area</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">{p.specs.area} sqft</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Price / sqft</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4 font-semibold text-slate-900">
                        {formatPrice(Math.round(p.price / p.specs.area))}/sqft
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">AI Investment Score</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                          <Sparkles className="h-3 w-3 text-emerald-600" />
                          {p.id === "p1" ? "9.6 / 10 Prime Growth" : "9.1 / 10 Strong Rental Yield"}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Furnishing</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">{p.specs.furnishing}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Amenities</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.amenities.map((a, i) => (
                            <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-slate-500 bg-slate-50/50">Action</td>
                    {comparedProperties.map((p) => (
                      <td key={p.id} className="p-4">
                        <Link to={`/properties/${p.id}`}>
                          <Button size="sm" className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* WISHLIST SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              My Saved Wishlist ({savedProperties.length})
            </h2>
            <Link to="/search" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Browse more properties <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {savedProperties.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <Heart className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Save properties while browsing to compare rates, monitor price reductions, and share with co-buyers.
              </p>
              <Link to="/search">
                <Button className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700 text-xs">
                  Start Exploring Homes
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <div key={property.id} className="relative group">
                  <PropertyCard property={property} />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <button
                      onClick={() => toggleCompare(property.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        comparePropertyIds.includes(property.id)
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {comparePropertyIds.includes(property.id) ? "✓ Added to Compare" : "+ Add to Compare"}
                    </button>
                    <button
                      onClick={() => toggleSaved(property.id)}
                      className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
