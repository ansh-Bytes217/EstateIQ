import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { Building2, Search, Heart, User, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const { role, setRole, savedPropertyIds, currency, setCurrency } = useStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-emerald-600">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-slate-900">EstateIQ</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/search" className="hover:text-emerald-600 transition-colors">Buy</Link>
            <Link to="/search?type=rent" className="hover:text-emerald-600 transition-colors">Rent</Link>
            <Link to="/search?type=commercial" className="hover:text-emerald-600 transition-colors">Commercial</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            className="hidden sm:flex items-center justify-center h-8 px-3 rounded-full bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {currency}
          </button>

          <Link to="/search">
            <Button variant="ghost" size="sm" className="hidden sm:flex px-2">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </Link>
          
          <Link to="/saved" className="relative text-slate-600 hover:text-emerald-600 transition-colors">
            <Heart className="h-5 w-5" />
            {savedPropertyIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">
                {savedPropertyIds.length}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          <div className="relative group">
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{role}</span>
            </Button>
            
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
              <div className="p-2 flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch Role</div>
                {(["BUYER", "AGENT", "LANDLORD", "TENANT"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      if (r !== "BUYER") {
                        navigate(`/dashboard/${r.toLowerCase()}`);
                      }
                    }}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${role === r ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-slate-100"}`}
                  >
                    {r}
                  </button>
                ))}
                <div className="h-px bg-slate-200 my-1"></div>
                {role !== "BUYER" && (
                  <Link to={`/dashboard/${role.toLowerCase()}`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
