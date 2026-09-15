import React from "react";
import { useParams, Link } from "react-router-dom";
import { MOCK_PROPERTIES } from "../data/mockData";
import { formatPrice } from "../lib/utils";
import { useStore } from "../store/useStore";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { MapPin, BedDouble, Bath, Square, CalendarClock, Phone, MessageCircle, Heart, Share, ChevronLeft } from "lucide-react";

export const PropertyDetails = () => {
  const { id } = useParams();
  const { currency, savedPropertyIds, toggleSaved } = useStore();
  
  const property = MOCK_PROPERTIES.find(p => p.id === id) || MOCK_PROPERTIES[0];
  const isSaved = savedPropertyIds.includes(property.id);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-6 pb-4">
        <Link to="/search" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Search
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="default">{property.status}</Badge>
              <Badge variant="neutral">{property.type}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{property.title}</h1>
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="h-4 w-4" />
              <span>{property.location.locality}, {property.location.city}</span>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-3">
            <div className="text-3xl font-bold text-emerald-700">
              {formatPrice(property.price, currency)}
              {property.status === "For Rent" && <span className="text-lg text-slate-500 font-normal"> / month</span>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleSaved(property.id)} className={isSaved ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}>
                <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-emerald-600" : ""}`} /> 
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[500px] rounded-2xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer">
            <img src={property.images[0]} alt="Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          {property.images.slice(1, 3).map((img, i) => (
            <div key={i} className="hidden md:block relative group cursor-pointer overflow-hidden">
              <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
          {/* Fill remaining with first image if not enough images */}
          {Array.from({length: Math.max(0, 4 - property.images.length)}).map((_, i) => (
            <div key={`fill-${i}`} className="hidden md:block relative group cursor-pointer overflow-hidden bg-slate-200">
               <img src={property.images[0]} className="w-full h-full object-cover opacity-50" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Specs Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap gap-6 justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <BedDouble className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{property.specs.beds}</div>
                  <div className="text-sm font-medium text-slate-500">Bedrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Bath className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{property.specs.baths}</div>
                  <div className="text-sm font-medium text-slate-500">Bathrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Square className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">{property.specs.area}</div>
                  <div className="text-sm font-medium text-slate-500">Sq. Ft.</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900">Ready</div>
                  <div className="text-sm font-medium text-slate-500">Possession</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About this property</h2>
              <div className="prose prose-slate max-w-none text-slate-600">
                <p>
                  Experience luxury living in this stunning {property.type.toLowerCase()} located in the highly sought-after neighborhood of {property.location.locality}. 
                  This exquisite property offers {property.specs.area} sqft of meticulously designed space, featuring {property.specs.beds} spacious bedrooms and {property.specs.baths} modern bathrooms.
                </p>
                <p>
                  The residence boasts high-end finishes, abundant natural light, and premium fixtures throughout. It comes {property.specs.furnishing.toLowerCase()} and is ready for immediate move-in. 
                  Residents will enjoy access to world-class amenities and unparalleled convenience to local attractions.
                </p>
              </div>
            </section>

            {/* Amenities */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-slate-700">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              {/* Action Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Interested in this property?</h3>
                
                <div className="space-y-3 mb-8">
                  <Button className="w-full" size="lg">Schedule a Viewing</Button>
                  <Button variant="outline" className="w-full" size="lg">Make an Offer</Button>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Listed By Agent</h4>
                  <div className="flex items-center gap-4 mb-6">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Agent" className="h-14 w-14 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-slate-900 text-lg">Sarah Jenkins</div>
                      <div className="text-sm text-slate-500 font-medium">Premium Realty</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full gap-2 text-slate-700 border-slate-300">
                      <Phone className="h-4 w-4" /> Call
                    </Button>
                    <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
