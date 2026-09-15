import React from "react";
import { Link } from "react-router-dom";

interface LocationCardProps {
  key?: React.Key;
  location: {
    city: string;
    image: string;
    count: number;
    medianPrice: string;
  };
}

export const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <Link 
      to={`/search?city=${encodeURIComponent(location.city)}`} 
      className="group block relative h-80 rounded-2xl overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-slate-900 z-10 opacity-20 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10"></div>
      
      <img 
        src={location.image} 
        alt={`Properties in ${location.city}`} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:-translate-y-1 transition-transform duration-300">{location.city}</h3>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-300 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
          <span>{location.count} active listings</span>
          <span className="w-1 h-1 rounded-full bg-slate-400"></span>
          <span>{location.medianPrice}</span>
        </div>
      </div>
    </Link>
  );
};
