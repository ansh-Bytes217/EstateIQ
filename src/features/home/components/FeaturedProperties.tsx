import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "../../../components/shared/PropertyCard";
import { MOCK_PROPERTIES } from "../../../data/mockData";

export const FeaturedProperties = () => {
  // Take up to 6 featured properties
  const featuredProperties = MOCK_PROPERTIES.filter(p => p.featured).slice(0, 6);

  if (featuredProperties.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-lg text-slate-600">
              Explore our hand-picked selection of premium real estate, representing the finest living experiences across top neighborhoods.
            </p>
          </div>
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap group"
          >
            View all properties 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} layout="grid" />
          ))}
        </div>
      </div>
    </section>
  );
};
