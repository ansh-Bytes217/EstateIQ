import React from "react";
import { QuickSearch } from "./QuickSearch";

export const Hero = () => {
  return (
    <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 flex items-center justify-center min-h-[600px] overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000" 
          alt="Modern Architecture" 
          className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90 mix-blend-multiply"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-5xl drop-shadow-lg">
          Find your next home.
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl font-light">
          Discover properties you'll love.
        </p>
        
        <QuickSearch />
      </div>
    </section>
  );
};
