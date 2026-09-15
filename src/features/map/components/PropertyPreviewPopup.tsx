import React from "react";
import { Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { Property } from "../../../types";
import { formatPrice } from "../../../lib/utils";
import { useStore } from "../../../store/useStore";
import { BedDouble, Bath, Square } from "lucide-react";

interface PropertyPreviewPopupProps {
  property: Property;
}

export const PropertyPreviewPopup = ({ property }: PropertyPreviewPopupProps) => {
  const { currency } = useStore();

  return (
    <Popup className="custom-popup" closeButton={false} autoPan={false}>
      <div className="w-56 overflow-hidden rounded-xl shadow-xl border border-slate-100 bg-white">
        <div className="relative h-32 bg-slate-100">
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-3">
          <div className="text-emerald-700 font-bold mb-1 text-lg">{formatPrice(property.price, currency)}</div>
          <div className="font-bold text-slate-900 line-clamp-1 text-sm mb-2">{property.title}</div>
          
          <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
            <div className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {property.specs.beds}</div>
            <div className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.specs.baths}</div>
            <div className="flex items-center gap-1"><Square className="h-3.5 w-3.5" /> {property.specs.area} sqft</div>
          </div>

          <Link 
            to={`/properties/${property.id}`} 
            className="block w-full py-2 bg-slate-900 text-white text-center text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            View Property
          </Link>
        </div>
      </div>
    </Popup>
  );
};
