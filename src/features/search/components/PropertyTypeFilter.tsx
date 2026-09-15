import React, { useState, useRef, useEffect } from "react";
import { useSearchFilters } from "../hooks/useSearchFilters";
import { ChevronDown, Check } from "lucide-react";

const PROPERTY_TYPES = [
  { id: "apartment", label: "Apartment" },
  { id: "villa", label: "Villa" },
  { id: "penthouse", label: "Penthouse" },
  { id: "house", label: "Independent House" },
  { id: "commercial", label: "Commercial" },
];

export const PropertyTypeFilter = () => {
  const { filters, updateFilters } = useSearchFilters();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedTypes = filters.propertyType || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleType = (id: string) => {
    let newTypes;
    if (selectedTypes.includes(id)) {
      newTypes = selectedTypes.filter(t => t !== id);
    } else {
      newTypes = [...selectedTypes, id];
    }
    updateFilters({ propertyType: newTypes.length > 0 ? newTypes : undefined });
  };

  const displayText = selectedTypes.length === 0 
    ? "Property Type" 
    : selectedTypes.length === 1 
      ? PROPERTY_TYPES.find(t => t.id === selectedTypes[0])?.label 
      : `${selectedTypes.length} Types Selected`;

  return (
    <div className="relative shrink-0" ref={wrapperRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors ${selectedTypes.length > 0 ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
      >
        {displayText}
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden py-1">
          {PROPERTY_TYPES.map(type => (
            <label 
              key={type.id} 
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTypes.includes(type.id) ? "bg-emerald-600 border-emerald-600" : "border-slate-300 bg-white"}`}>
                {selectedTypes.includes(type.id) && <Check className="h-3.5 w-3.5 text-white" />}
              </div>
              <span className="text-sm text-slate-700 font-medium">{type.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
