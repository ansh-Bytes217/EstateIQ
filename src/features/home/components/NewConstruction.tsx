import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { PropertyCard } from "../../../components/shared/PropertyCard";
import { MOCK_PROPERTIES } from "../../../data/mockData";

export const NewConstruction = () => {
  const newProperties = MOCK_PROPERTIES.filter(p => p.isNewConstruction).slice(0, 3);

  if (newProperties.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 rounded-l-[100px] blur-3xl mix-blend-screen pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="h-4 w-4" /> New Launch
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              New Construction & Pre-launch
            </h2>
            <p className="text-lg text-slate-300">
              Be the first to invest in the latest developments. Discover brand new properties with modern amenities and high appreciation potential.
            </p>
          </div>
          <Link 
            to="/search?intent=new" 
            className="inline-flex items-center gap-2 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap group"
          >
            Explore new projects 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newProperties.map(property => (
            <div key={property.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative bg-slate-800 rounded-xl h-full">
                <PropertyCard property={property} layout="grid" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
