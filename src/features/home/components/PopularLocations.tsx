import React from "react";
import { LocationCard } from "./LocationCard";

const LOCATIONS = [
  { city: "Mumbai", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600", count: 2481, medianPrice: "₹25,200/sqft" },
  { city: "Bangalore", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600", count: 1842, medianPrice: "₹8,400/sqft" },
  { city: "Delhi", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600", count: 1530, medianPrice: "₹12,100/sqft" },
  { city: "Pune", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600", count: 941, medianPrice: "₹7,200/sqft" },
  { city: "Hyderabad", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600", count: 1102, medianPrice: "₹6,800/sqft" },
  { city: "Ahmedabad", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=600", count: 856, medianPrice: "₹5,200/sqft" },
];

export const PopularLocations = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Popular Locations
          </h2>
          <p className="text-lg text-slate-600">
            Discover investment opportunities and vibrant communities in India's most sought-after real estate markets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((location) => (
            <LocationCard key={location.city} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
};
