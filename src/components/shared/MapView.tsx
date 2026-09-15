import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MOCK_PROPERTIES } from "../../data/mockData";
import { formatPrice } from "../../lib/utils";
import { useStore } from "../../store/useStore";

// Fix for default marker icon in leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const MapView = () => {
  const { currency } = useStore();
  const properties = MOCK_PROPERTIES;
  
  // Center roughly on India if multiple cities, or just pick first property
  const center: [number, number] = properties.length > 0 
    ? properties[0].location.coordinates 
    : [20.5937, 78.9629];

  return (
    <div className="w-full h-full z-0 relative">
      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {properties.map(property => {
          // Custom SVG Icon could be created here using L.divIcon
          const customIcon = L.divIcon({
            className: 'custom-price-marker',
            html: `<div class="bg-emerald-600 text-white font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white whitespace-nowrap text-sm hover:bg-emerald-700 transition-colors cursor-pointer">${formatPrice(property.price, currency)}</div>`,
            iconSize: [60, 24],
            iconAnchor: [30, 12],
          });

          return (
            <Marker 
              key={property.id} 
              position={property.location.coordinates}
              icon={customIcon}
            >
              <Popup className="custom-popup">
                <div className="w-48 overflow-hidden rounded-xl">
                  <img src={property.images[0]} alt={property.title} className="w-full h-32 object-cover" />
                  <div className="p-3 bg-white">
                    <div className="font-bold text-slate-900 line-clamp-1 text-sm">{property.title}</div>
                    <div className="text-emerald-700 font-bold mb-1">{formatPrice(property.price, currency)}</div>
                    <div className="text-xs text-slate-500">{property.specs.beds} Beds • {property.specs.baths} Baths</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
