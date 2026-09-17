import React, { useState } from "react";
import { History, Receipt, ArrowUpRight, ArrowDownRight, FileText, CheckCircle2 } from "lucide-react";
import { Property } from "../../types";
import { formatPrice } from "../../lib/utils";
import { useStore } from "../../store/useStore";

interface PriceTaxHistoryProps {
  property: Property;
}

export const PriceTaxHistory: React.FC<PriceTaxHistoryProps> = ({ property }) => {
  const { currency } = useStore();
  const [activeTab, setActiveTab] = useState<"price" | "tax">("price");

  const priceHistory = property.priceHistory || [];
  const taxHistory = property.taxHistory || [];

  const getEventBadge = (event: string) => {
    switch (event) {
      case "Listed":
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">Listed</span>;
      case "Sold":
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">Sold</span>;
      case "Pending":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">Pending</span>;
      case "Price Change":
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">Price Change</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">{event}</span>;
    }
  };

  return (
    <div id="price-history" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-bold text-slate-950 tracking-tight">Price & Tax Assessment History</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified deed transactions, price adjustments, and official municipality property tax assessments.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("price")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "price"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <History className="h-3.5 w-3.5 text-emerald-600" /> Price History ({priceHistory.length})
          </button>
          <button
            onClick={() => setActiveTab("tax")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "tax"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Receipt className="h-3.5 w-3.5 text-teal-600" /> Property Taxes ({taxHistory.length})
          </button>
        </div>
      </div>

      {/* PRICE HISTORY TABLE */}
      {activeTab === "price" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Date</th>
                <th className="pb-3">Event</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Change</th>
                <th className="pb-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {priceHistory.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 text-slate-900 font-semibold">{item.date}</td>
                  <td className="py-3.5">{getEventBadge(item.event)}</td>
                  <td className="py-3.5 font-bold text-slate-900">{formatPrice(item.price, currency)}</td>
                  <td className="py-3.5">
                    {item.priceChangePercent && item.priceChangePercent !== 0 ? (
                      item.priceChangePercent > 0 ? (
                        <span className="text-emerald-600 flex items-center font-bold">
                          <ArrowUpRight className="h-3.5 w-3.5" /> +{item.priceChangePercent}%
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center font-bold">
                          <ArrowDownRight className="h-3.5 w-3.5" /> {item.priceChangePercent}%
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-500 font-normal">{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAX HISTORY TABLE */}
      {activeTab === "tax" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Tax Year</th>
                <th className="pb-3">Property Taxes Paid</th>
                <th className="pb-3">Tax Assessed Value</th>
                <th className="pb-3">Effective Tax Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {taxHistory.map((item, i) => {
                const effectiveRate = ((item.propertyTax / item.taxAssessment) * 100).toFixed(2);
                return (
                  <tr key={i} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 text-slate-900 font-bold">{item.year}</td>
                    <td className="py-3.5 font-bold text-slate-900">{formatPrice(item.propertyTax, currency)}</td>
                    <td className="py-3.5 text-slate-700 font-semibold">{formatPrice(item.taxAssessment, currency)}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {effectiveRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
