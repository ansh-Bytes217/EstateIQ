import React from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-emerald-600">
              <Building2 className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight text-slate-900">EstateIQ</span>
            </Link>
            <p className="text-sm text-slate-500">
              Enterprise-grade real-estate marketplace and property-management platform combining property discovery, advanced search, and management.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Properties</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/search?type=Apartment" className="hover:text-emerald-600">Apartments for Sale</Link></li>
              <li><Link to="/search?type=Villa" className="hover:text-emerald-600">Luxury Villas</Link></li>
              <li><Link to="/search?type=Penthouse" className="hover:text-emerald-600">Penthouses</Link></li>
              <li><Link to="/search?type=Commercial" className="hover:text-emerald-600">Commercial Spaces</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Locations</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/search?city=Mumbai" className="hover:text-emerald-600">Mumbai</Link></li>
              <li><Link to="/search?city=Delhi" className="hover:text-emerald-600">Delhi NCR</Link></li>
              <li><Link to="/search?city=Bangalore" className="hover:text-emerald-600">Bangalore</Link></li>
              <li><Link to="/search?city=Pune" className="hover:text-emerald-600">Pune</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-emerald-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-600">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-600">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-600">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EstateIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
