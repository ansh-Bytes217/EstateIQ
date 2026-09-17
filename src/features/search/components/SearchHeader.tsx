import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { propertyService } from "../../../services/propertyService";
import { useSearchFilters } from "../hooks/useSearchFilters";

export const SearchHeader = () => {
  const { filters, updateFilters } = useSearchFilters();
  const [query, setQuery] = useState(filters.city || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setQuery(filters.city || "");
  }, [filters.city]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        const results = await propertyService.getLocationSuggestions(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    setQuery(city);
    setShowSuggestions(false);
    updateFilters({ city });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    updateFilters({ city: query });
  };

  return (
    <div className="bg-white border-b border-slate-200 py-4 px-4 sticky top-16 z-20 shadow-sm">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center gap-4">
        <form onSubmit={handleSubmit} className="w-full sm:w-96 relative" ref={wrapperRef}>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <MapPin className="h-5 w-5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search city or location..."
              className="bg-transparent w-full outline-none text-slate-900"
            />
            <button type="submit" className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
              {suggestions.map((city) => (
                <div 
                  key={city}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-2 text-slate-700 transition-colors"
                  onClick={() => handleSelect(city)}
                >
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {city}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
