import React from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3 lg:grid-cols-6">
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
            <h4 className="font-semibold text-slate-900 mb-4">Buy</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/buy" className="hover:text-emerald-600">Buy a home</Link></li>
              <li><Link to="/search?type=Apartment&status=For+Sale" className="hover:text-emerald-600">Apartments</Link></li>
              <li><Link to="/search?type=Villa&status=For+Sale" className="hover:text-emerald-600">Villas</Link></li>
              <li><Link to="/search?filter=ready" className="hover:text-emerald-600">Ready to move</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Rent</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/rent" className="hover:text-emerald-600">Rent a home</Link></li>
              <li><Link to="/search?type=Apartment&status=For+Rent" className="hover:text-emerald-600">Apartments for rent</Link></li>
              <li><Link to="/search?filter=owner" className="hover:text-emerald-600">Owner properties</Link></li>
              <li><Link to="/search?filter=no-brokerage" className="hover:text-emerald-600">No brokerage</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Sell</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/sell" className="hover:text-emerald-600">Sell your property</Link></li>
              <li><Link to="/sell" className="hover:text-emerald-600">Property valuation</Link></li>
              <li><Link to="/dashboard/agent" className="hover:text-emerald-600">Agent dashboard</Link></li>
              <li><Link to="/sell" className="hover:text-emerald-600">Post property free</Link></li>
            </ul>
          </div>
          <div><h4 className="font-semibold text-slate-900 mb-4">Home Loans</h4><ul className="space-y-3 text-sm text-slate-500"><li><Link to="/home-loans" className="hover:text-emerald-600">EMI calculator</Link></li><li><Link to="/home-loans" className="hover:text-emerald-600">Compare lenders</Link></li><li><Link to="/home-loans" className="hover:text-emerald-600">Loan eligibility</Link></li></ul></div>
          <div><h4 className="font-semibold text-slate-900 mb-4">Insights</h4><ul className="space-y-3 text-sm text-slate-500"><li><Link to="/insights" className="hover:text-emerald-600">Market trends</Link></li><li><Link to="/insights" className="hover:text-emerald-600">Locality guides</Link></li><li><Link to="/insights" className="hover:text-emerald-600">Buyer advice</Link></li></ul></div>
          <div><h4 className="font-semibold text-slate-900 mb-4">Explore</h4><ul className="space-y-3 text-sm text-slate-500"><li><Link to="/search" className="hover:text-emerald-600">Search properties</Link></li><li><Link to="/saved" className="hover:text-emerald-600">Saved properties</Link></li><li><Link to="/app" className="hover:text-emerald-600">Property workspace</Link></li></ul></div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EstateIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
