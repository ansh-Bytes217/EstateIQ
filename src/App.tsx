/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { PropertyDetails } from "./pages/PropertyDetails";
import { AgentDashboard } from "./components/dashboard/AgentDashboard";

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
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/saved" element={<div className="container mx-auto p-8"><h1 className="text-2xl font-bold">Saved Properties</h1><p className="mt-4 text-slate-500">Feature coming soon...</p></div>} />
          </Route>
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="agent" element={<AgentDashboard />} />
            <Route path="landlord" element={<div className="p-6"><h1 className="text-2xl font-bold">Landlord Dashboard</h1></div>} />
            <Route path="tenant" element={<div className="p-6"><h1 className="text-2xl font-bold">Tenant Dashboard</h1></div>} />
            <Route path="*" element={<div className="p-6">Feature in development...</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
