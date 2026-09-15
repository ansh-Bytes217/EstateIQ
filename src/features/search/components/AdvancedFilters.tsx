import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useSearchFilters } from "../hooks/useSearchFilters";

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedFilters = ({ isOpen, onClose }: AdvancedFiltersProps) => {
  const { filters, updateFilters, clearFilters } = useSearchFilters();
  
  // Local state to hold filters before applying
  const [localFilters, setLocalFilters] = React.useState(filters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleApply = () => {
    updateFilters(localFilters, true);
    onClose();
  };

  const handleReset = () => {
    clearFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Filters</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Baths */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Bathrooms</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Any", value: undefined },
                { label: "1+", value: 1 },
                { label: "2+", value: 2 },
                { label: "3+", value: 3 },
                { label: "4+", value: 4 },
                { label: "5+", value: 5 },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setLocalFilters({ ...localFilters, baths: opt.value })}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    localFilters.baths === opt.value 
                      ? "bg-emerald-600 border-emerald-600 text-white" 
                      : "bg-white border-slate-200 text-slate-700 hover:border-emerald-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Furnishing</h3>
            <div className="flex flex-col gap-3">
              {["Furnished", "Semi-Furnished", "Unfurnished"].map(opt => {
                const value = opt.toLowerCase();
                const current = localFilters.furnishing || [];
                const isSelected = current.includes(value);
                
                const toggle = () => {
                  if (isSelected) {
                    setLocalFilters({ ...localFilters, furnishing: current.filter(v => v !== value) });
                  } else {
                    setLocalFilters({ ...localFilters, furnishing: [...current, value] });
                  }
                };
                
                return (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggle(); }}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-emerald-600 border-emerald-600" : "border-slate-300 bg-white group-hover:border-emerald-400"}`}>
                      {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-slate-700 font-medium">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
          <button 
            onClick={handleReset}
            className="text-slate-600 font-semibold hover:text-slate-900 transition-colors underline"
          >
            Clear All
          </button>
          <Button onClick={handleApply} className="px-8">
            Show Results
          </Button>
        </div>
      </div>
    </div>
  );
};
