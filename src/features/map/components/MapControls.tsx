import React from "react";
import { useMap } from "react-leaflet";
import { Plus, Minus, Focus, Map as MapIcon } from "lucide-react";
import L from "leaflet";
import { Property } from "../../../types";

interface MapControlsProps {
  properties: Property[];
}

export const MapControls = ({ properties }: MapControlsProps) => {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  
  const handleFitResults = () => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => p.location.coordinates as [number, number]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  return (
    <div className="absolute right-4 bottom-8 lg:bottom-12 z-[400] flex flex-col gap-2">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
        <button 
          onClick={handleZoomIn}
          className="p-3 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 border-b border-slate-100 transition-colors focus:outline-none focus:bg-slate-100"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-3 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors focus:outline-none focus:bg-slate-100"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
      
      <button 
        onClick={handleFitResults}
        className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors focus:outline-none focus:bg-slate-100 mt-2"
        aria-label="Fit results"
        title="Fit map to results"
      >
        <Focus className="w-5 h-5" />
      </button>
    </div>
  );
};
