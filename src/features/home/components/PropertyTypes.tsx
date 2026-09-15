import React from "react";
import { Link } from "react-router-dom";
import { Building2, Home, Building, TreePine, Map, Briefcase } from "lucide-react";

const TYPES = [
  { id: "apartment", name: "Apartments", icon: Building2, desc: "Modern city living spaces" },
  { id: "villa", name: "Villas", icon: Home, desc: "Luxury independent homes" },
  { id: "penthouse", name: "Penthouses", icon: Building, desc: "Exclusive top-floor residences" },
  { id: "house", name: "Independent Houses", icon: TreePine, desc: "Spacious family homes" },
  { id: "plot", name: "Plots", icon: Map, desc: "Build your dream home" },
  { id: "commercial", name: "Commercial", icon: Briefcase, desc: "Offices and retail spaces" },
];

export const PropertyTypes = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center tracking-tight">
          Explore Property Types
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {TYPES.map((type) => (
            <Link
              key={type.id}
              to={`/search?type=${type.id}`}
              className="flex flex-col items-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all text-center group"
            >
              <div className="h-16 w-16 bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 rounded-full flex items-center justify-center mb-4 transition-colors">
                <type.icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{type.name}</h3>
              <p className="text-xs text-slate-500">{type.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
