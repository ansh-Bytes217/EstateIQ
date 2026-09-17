import React from "react";
import { Link } from "react-router-dom";
import { BedDouble, Bath, Square, ArrowRight, Scale, Sparkles } from "lucide-react";
import { Property } from "../../types";
import { MOCK_PROPERTIES } from "../../data/mockData";
import { formatPrice } from "../../lib/utils";
import { useStore } from "../../store/useStore";

interface SimilarHomesProps {
  currentProperty: Property;
}

export const SimilarHomes: React.FC<SimilarHomesProps> = ({ currentProperty }) => {
  const { currency, comparePropertyIds, toggleCompare } = useStore();

  // Pick 3 similar homes
  const similarHomes = MOCK_PROPERTIES.filter((p) => p.id !== currentProperty.id).slice(0, 3);

  return (
    <div id="similar-homes" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-950 tracking-tight">Similar Nearby Homes</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparable active listings with similar square footage and bedroom configurations.
          </p>
        </div>
        <Link
          to="/search"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
        >
          View all in area <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {similarHomes.map((home) => {
          const isComparing = comparePropertyIds.includes(home.id);
          const pricePerSqft = Math.round(home.price / home.specs.area);

          return (
            <div
              key={home.id}
              className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between bg-slate-50/50"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={home.images[0]}
                    alt={home.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                    {formatPrice(home.price, currency)}
                  </div>
                  {home.zestimate && (
                    <div className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Sparkles className="h-2.5 w-2.5" /> Est. {formatPrice(home.zestimate.estimatedValue, currency)}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-700 transition">
                    {home.title}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">
                    {home.location.locality}, {home.location.city}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5 text-slate-400" /> {home.specs.beds} bds
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-slate-400" /> {home.specs.baths} ba
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Square className="h-3.5 w-3.5 text-slate-400" /> {home.specs.area} sqft
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400">{formatPrice(pricePerSqft, currency)}/sqft</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCompare(home.id)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                      isComparing
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Compare side-by-side"
                  >
                    <Scale className="h-3.5 w-3.5" />
                    {isComparing ? "Comparing" : "Compare"}
                  </button>
                  <Link
                    to={`/properties/${home.id}`}
                    className="p-1.5 px-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
