import React from "react";
import { TrendingUp, Sparkles, HelpCircle, ShieldCheck, ArrowUpRight, ArrowDownRight, Home } from "lucide-react";
import { Property } from "../../types";
import { formatPrice } from "../../lib/utils";
import { useStore } from "../../store/useStore";

interface ZestimateCardProps {
  property: Property;
}

export const ZestimateCard: React.FC<ZestimateCardProps> = ({ property }) => {
  const { currency } = useStore();
  const z = property.zestimate;

  if (!z) return null;

  const diffFromList = z.estimatedValue - property.price;
  const isAboveList = diffFromList >= 0;
  const diffPercent = Math.abs((diffFromList / property.price) * 100).toFixed(1);

  const pricePerSqFt = Math.round(property.price / property.specs.area);
  const zestimatePerSqFt = Math.round(z.estimatedValue / property.specs.area);

  return (
    <div id="zestimate" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-950 tracking-tight">EstateEstimate®</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="h-3 w-3" /> {z.confidenceScore}% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated Valuation Model (AVM) synthesized from public records, deed registries, and micro-market comp sales.
            </p>
          </div>
        </div>

        <div className="text-right sm:text-right">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatPrice(z.estimatedValue, currency)}
          </div>
          <div className="flex items-center sm:justify-end gap-1 text-xs font-semibold mt-0.5">
            {isAboveList ? (
              <span className="text-emerald-600 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" /> +{formatPrice(diffFromList, currency)} ({diffPercent}%) above list price
              </span>
            ) : (
              <span className="text-amber-600 flex items-center">
                <ArrowDownRight className="h-3.5 w-3.5" /> -{formatPrice(Math.abs(diffFromList), currency)} ({diffPercent}%) under list price
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3 Metric Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Estimated Range */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Valuation Range
          </div>
          <div className="text-base font-bold text-slate-900">
            {formatPrice(z.rangeLow, currency)} – {formatPrice(z.rangeHigh, currency)}
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "68%" }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>Conservative</span>
            <span>Median</span>
            <span>Optimistic</span>
          </div>
        </div>

        {/* 1-Year Forecast */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            1-Year Forecast
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-emerald-600">+{z.oneYearForecastPercent}%</span>
            <span className="text-xs text-slate-500">projected appreciation</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Based on {property.location.locality}'s 36-month appreciation CAGR.
          </p>
        </div>

        {/* Rent Zestimate */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Rent EstateEstimate®
          </div>
          <div className="text-base font-bold text-slate-900">
            {z.estimatedRent ? `${formatPrice(z.estimatedRent, currency)}/mo` : "N/A"}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Gross rental yield ~{((((z.estimatedRent || 0) * 12) / z.estimatedValue) * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Comparison to Area Sq. Ft. */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">Price / Sq. Ft.:</span>
          <span>{formatPrice(pricePerSqFt, currency)}/sqft</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-900">EstateEstimate / Sq. Ft.:</span>
          <span>{formatPrice(zestimatePerSqFt, currency)}/sqft</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Last algorithm calibration: 2 days ago</span>
        </div>
      </div>
    </div>
  );
};
