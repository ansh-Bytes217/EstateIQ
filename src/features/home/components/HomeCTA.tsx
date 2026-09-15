import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

export const HomeCTA = () => {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-900/10 pattern-grid-lg text-white/5"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to find your next property?
        </h2>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
          Join thousands of users discovering premium homes, apartments, and commercial spaces on EstateIQ.
        </p>
        <Link to="/search">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white border-none shadow-lg shadow-emerald-900/50 text-lg h-14 px-10">
            Explore Properties
          </Button>
        </Link>
      </div>
    </section>
  );
};
