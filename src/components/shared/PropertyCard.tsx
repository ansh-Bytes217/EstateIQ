import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Property } from "../../types";
import { formatPrice } from "../../lib/utils";
import { useStore } from "../../store/useStore";
import { useMapStore } from "../../features/map/store/useMapStore";
import { BedDouble, Bath, Square, MapPin, Heart } from "lucide-react";
import { Badge } from "../ui/Badge";

interface PropertyCardProps {
  key?: React.Key;
  property: Property;
  layout?: "grid" | "list";
}

export const PropertyCard = ({ property, layout = "grid" }: PropertyCardProps) => {
  const { currency, savedPropertyIds, toggleSaved } = useStore();
  const { selectedPropertyId, hoveredPropertyId, setSelectedPropertyId, setHoveredPropertyId } = useMapStore();
  
  const isSaved = savedPropertyIds.includes(property.id);
  const isSelected = selectedPropertyId === property.id;
  const isHovered = hoveredPropertyId === property.id;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  const handleMouseEnter = () => setHoveredPropertyId(property.id);
  const handleMouseLeave = () => setHoveredPropertyId(null);
  const handleClick = () => setSelectedPropertyId(isSelected ? null : property.id);

  const baseClasses = `transition-all duration-300 group cursor-pointer ${
    isSelected 
      ? "ring-2 ring-emerald-500 shadow-md bg-emerald-50/30" 
      : isHovered 
        ? "ring-1 ring-emerald-300 shadow-md bg-white" 
        : "border border-slate-200 bg-white hover:shadow-md"
  }`;

  if (layout === "list") {
    return (
      <div 
        ref={cardRef}
        className={`flex flex-col sm:flex-row gap-4 rounded-xl overflow-hidden ${baseClasses}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="sm:w-64 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-slate-100">
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="default">{property.status}</Badge>
            {property.featured && <Badge variant="warning">Featured</Badge>}
            {property.isNewConstruction && <Badge variant="success">New</Badge>}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleSaved(property.id); }}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors z-10"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-emerald-600 text-emerald-600" : ""}`} />
          </button>
        </div>
        
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500 flex items-center gap-1 mb-1">
              <MapPin className="h-3.5 w-3.5" />
              {property.location.locality}, {property.location.city}
            </div>
            <Link to={`/properties/${property.id}`} onClick={(e) => e.stopPropagation()} className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
              {property.title}
            </Link>
            <div className="text-2xl font-bold text-emerald-700 mb-4">
              {formatPrice(property.price, currency)}
              {property.status === "For Rent" && <span className="text-sm text-slate-500 font-normal"> /mo</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-slate-400" /> {property.specs.beds} Beds</div>
            <div className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-slate-400" /> {property.specs.baths} Baths</div>
            <div className="flex items-center gap-1.5"><Square className="h-4 w-4 text-slate-400" /> {property.specs.area} sqft</div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Layout Default
  return (
    <div 
      ref={cardRef}
      className={`rounded-xl overflow-hidden flex flex-col ${baseClasses}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="h-56 w-full relative overflow-hidden bg-slate-100 shrink-0">
        <Link to={`/properties/${property.id}`} onClick={(e) => e.stopPropagation()}>
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </Link>
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pointer-events-none">
          <Badge variant="default">{property.status}</Badge>
          {property.featured && <Badge variant="warning">Featured</Badge>}
          {property.isNewConstruction && <Badge variant="success">New</Badge>}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleSaved(property.id); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors z-10"
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-emerald-600 text-emerald-600" : ""}`} />
        </button>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-2xl font-bold text-emerald-700 mb-1">
          {formatPrice(property.price, currency)}
          {property.status === "For Rent" && <span className="text-sm text-slate-500 font-normal"> /mo</span>}
        </div>
        <Link to={`/properties/${property.id}`} onClick={(e) => e.stopPropagation()} className="text-lg font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1 mb-1">
          {property.title}
        </Link>
        <div className="text-sm text-slate-500 flex items-center gap-1 mb-4">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{property.location.locality}, {property.location.city}</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-slate-400" /> {property.specs.beds}</div>
          <div className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-slate-400" /> {property.specs.baths}</div>
          <div className="flex items-center gap-1.5"><Square className="h-4 w-4 text-slate-400" /> {property.specs.area} sqft</div>
        </div>
      </div>
    </div>
  );
};
