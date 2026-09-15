import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Property } from "../../../types";
import { formatPrice } from "../../../lib/utils";
import { useStore } from "../../../store/useStore";
import { useMapStore } from "../store/useMapStore";
import { useSearchFilters } from "../../search/hooks/useSearchFilters";
import { PropertyPreviewPopup } from "./PropertyPreviewPopup";
import { MapControls } from "./MapControls";

// Fix default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface PropertyMapProps {
  properties: Property[];
  isLoading?: boolean;
}

const MapLoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;
  return (
    <div className="absolute top-4 right-4 z-[400] bg-white rounded-lg shadow-md border border-slate-200 px-3 py-2 flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-medium text-slate-700">Searching...</span>
    </div>
  );
};

const MapEvents = () => {
  const { searchAsIMove, setMapBounds } = useMapStore();

  useMapEvents({
    moveend: (e) => {
      const bounds = e.target.getBounds();
      setMapBounds({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
    }
  });
  return null;
};

const FitBounds = ({ properties }: { properties: Property[] }) => {
  const map = useMap();
  const prevPropsRef = useRef<string>("");
  const { searchAsIMove } = useMapStore();

  useEffect(() => {
    const propsString = properties.map(p => p.id).join(",");
    // Only fit bounds if the dataset actually changes in identity, and we have properties.
    // NEVER auto-fit if the user is in "Search as I move" mode, because they are manually controlling the viewport.
    if (properties.length > 0 && prevPropsRef.current !== propsString) {
      if (!searchAsIMove) {
        const bounds = L.latLngBounds(properties.map(p => p.location.coordinates as [number, number]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
      prevPropsRef.current = propsString;
    }
  }, [properties, map, searchAsIMove]);

  return null;
};

const CenterOnSelected = ({ properties }: { properties: Property[] }) => {
  const map = useMap();
  const { selectedPropertyId } = useMapStore();
  
  useEffect(() => {
    if (selectedPropertyId) {
      const selected = properties.find(p => p.id === selectedPropertyId);
      if (selected) {
        map.setView(selected.location.coordinates, 15, { animate: true });
      }
    }
  }, [selectedPropertyId, map, properties]);

  return null;
};

const MapEmptyOverlay = ({ isVisible }: { isVisible: boolean }) => {
  const map = useMap();
  
  if (!isVisible) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center border border-slate-200 max-w-[280px]">
      <h3 className="text-lg font-bold text-slate-900 mb-2">No homes in this area</h3>
      <p className="text-sm text-slate-500 mb-4">Try moving the map or zooming out to find more properties.</p>
      <button 
        onClick={() => map.zoomOut(1)}
        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
      >
        Zoom Out
      </button>
    </div>
  );
};

export const PropertyMap = ({ properties, isLoading = false }: PropertyMapProps) => {
  const { currency } = useStore();
  const { selectedPropertyId, hoveredPropertyId, setSelectedPropertyId, setHoveredPropertyId } = useMapStore();
  
  // Default center if no properties
  const center: [number, number] = properties.length > 0 
    ? properties[0].location.coordinates 
    : [20.5937, 78.9629];

  return (
    <div className="w-full h-full relative z-0">
      <MapLoadingOverlay isVisible={isLoading} />
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} // We will use default zoom but can position it
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapEvents />
        <FitBounds properties={properties} />
        <CenterOnSelected properties={properties} />
        <MapEmptyOverlay isVisible={properties.length === 0} />
        <MapControls properties={properties} />
        
        {properties.map(property => {
          const isSelected = selectedPropertyId === property.id;
          const isHovered = hoveredPropertyId === property.id;
          
          const getMarkerHtml = () => {
             const baseClasses = "px-3 py-1 rounded-full shadow-md border-2 whitespace-nowrap text-sm font-bold transition-all cursor-pointer pointer-events-auto relative";
             if (isSelected) {
               return `<div class="${baseClasses} bg-slate-900 text-white border-white scale-110 z-50">
                         ${formatPrice(property.price, currency)}
                         <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
                       </div>`;
             }
             if (isHovered) {
                return `<div class="${baseClasses} bg-emerald-700 text-white border-white scale-105 z-40">
                         ${formatPrice(property.price, currency)}
                       </div>`;
             }
             return `<div class="${baseClasses} bg-emerald-600 text-white border-white hover:bg-emerald-700 hover:scale-105 z-30">
                       ${formatPrice(property.price, currency)}
                     </div>`;
          };

          const customIcon = L.divIcon({
            className: 'bg-transparent border-none', // Remove default styles
            html: getMarkerHtml(),
            iconSize: [80, 30],
            iconAnchor: [40, 15],
            popupAnchor: [0, -15],
          });

          return (
            <Marker 
              key={property.id} 
              position={property.location.coordinates}
              icon={customIcon}
              zIndexOffset={isSelected ? 1000 : (isHovered ? 500 : 0)}
              eventHandlers={{
                click: () => {
                  setSelectedPropertyId(isSelected ? null : property.id);
                },
                mouseover: () => {
                  setHoveredPropertyId(property.id);
                },
                mouseout: () => {
                  setHoveredPropertyId(null);
                }
              }}
            >
              {/* Render popup only if selected */}
              {isSelected && (
                <PropertyPreviewPopup property={property} />
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
