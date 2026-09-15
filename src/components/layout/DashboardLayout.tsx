import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { Building2, LayoutDashboard, Home, Users, Settings, Wrench, FileText, Bell } from "lucide-react";

export const DashboardLayout = () => {
  const { role } = useStore();
  const location = useLocation();

  const getNavItems = () => {
    switch (role) {
      case "AGENT":
        return [
          { name: "Overview", path: "/dashboard/agent", icon: LayoutDashboard },
          { name: "My Listings", path: "/dashboard/agent/listings", icon: Home },
          { name: "Leads & Clients", path: "/dashboard/agent/clients", icon: Users },
        ];
      case "LANDLORD":
        return [
          { name: "Portfolio", path: "/dashboard/landlord", icon: LayoutDashboard },
          { name: "Properties", path: "/dashboard/landlord/properties", icon: Building2 },
          { name: "Maintenance", path: "/dashboard/landlord/maintenance", icon: Wrench },
        ];
      case "TENANT":
        return [
          { name: "My Lease", path: "/dashboard/tenant", icon: FileText },
          { name: "Payments", path: "/dashboard/tenant/payments", icon: LayoutDashboard },
          { name: "Maintenance", path: "/dashboard/tenant/maintenance", icon: Wrench },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-emerald-400">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-white">EstateIQ</span>
          </Link>
        </div>
        
        <div className="p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
            {role} Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== `/dashboard/${role.toLowerCase()}` && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                    isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="font-semibold text-lg text-slate-800">
            {navItems.find(i => location.pathname === i.path)?.name || "Dashboard"}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm">
              {role.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
