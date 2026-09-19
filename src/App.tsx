/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { MarketplaceExperience } from "./features/marketplace/MarketplaceExperience";
import { Search } from "./pages/Search";
import { PropertyDetails } from "./pages/PropertyDetails";
import { AgentDashboard } from "./components/dashboard/AgentDashboard";
import { LandlordDashboard } from "./components/dashboard/LandlordDashboard";
import { TenantDashboard } from "./components/dashboard/TenantDashboard";
import { SavedProperties } from "./pages/SavedProperties";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { BuyPage } from "./pages/BuyPage";
import { EnterpriseHome } from "./features/enterprise/EnterpriseHome";
import { EnterpriseInsightsPage, EnterpriseLoansPage, EnterpriseRentPage, EnterpriseSellPage } from "./features/enterprise/EnterpriseSections";
import { useStore } from "./store/useStore";
import { AIAgentDrawer } from "./components/command-center/AIAgentDrawer";
import type { Role } from "./types";

function ProtectedDashboard({ role, children }: { role: Exclude<Role, "BUYER">; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const currentRole = useStore((state) => state.role);
  const demoMode = useStore((state) => state.demoMode);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && !demoMode) {
      navigate("/", { replace: true });
    }
  }, [loading, navigate, user, demoMode]);

  if (!demoMode && (loading || !user || currentRole !== role)) return null;
  return <>{children}</>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AIAgentDrawer />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<EnterpriseHome />} />
              <Route path="/buy" element={<BuyPage />} />
              <Route path="/rent" element={<EnterpriseRentPage />} />
              <Route path="/sell" element={<EnterpriseSellPage />} />
              <Route path="/home-loans" element={<EnterpriseLoansPage />} />
              <Route path="/insights" element={<EnterpriseInsightsPage />} />
              <Route path="/app" element={<MarketplaceExperience />} />
              <Route path="/search" element={<Search />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/saved" element={<SavedProperties />} />
            </Route>

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="agent" element={<ProtectedDashboard role="AGENT"><AgentDashboard /></ProtectedDashboard>} />
              <Route path="agent/*" element={<ProtectedDashboard role="AGENT"><AgentDashboard /></ProtectedDashboard>} />
              <Route path="landlord" element={<ProtectedDashboard role="LANDLORD"><LandlordDashboard /></ProtectedDashboard>} />
              <Route path="landlord/*" element={<ProtectedDashboard role="LANDLORD"><LandlordDashboard /></ProtectedDashboard>} />
              <Route path="tenant" element={<ProtectedDashboard role="TENANT"><TenantDashboard /></ProtectedDashboard>} />
              <Route path="tenant/*" element={<ProtectedDashboard role="TENANT"><TenantDashboard /></ProtectedDashboard>} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

