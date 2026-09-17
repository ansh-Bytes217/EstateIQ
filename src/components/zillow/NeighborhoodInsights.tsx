import React from "react";
import { GraduationCap, Footprints, Bus, Bike, AlertTriangle, CloudRain, Flame, SunMedium, ShieldAlert } from "lucide-react";
import { Property, SchoolInfo } from "../../types";

interface NeighborhoodInsightsProps {
  property: Property;
}

export const NeighborhoodInsights: React.FC<NeighborhoodInsightsProps> = ({ property }) => {
  const schools = property.schools || [];
  const scores = property.scores;
  const climate = property.climateRisks;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-100 border-emerald-300";
    if (score >= 70) return "text-teal-700 bg-teal-100 border-teal-300";
    if (score >= 50) return "text-amber-700 bg-amber-100 border-amber-300";
    return "text-rose-700 bg-rose-100 border-rose-300";
  };

  const getRatingBadge = (rating: number) => {
    let color = "bg-emerald-600 text-white";
    if (rating < 7) color = "bg-amber-500 text-white";
    if (rating < 5) color = "bg-rose-500 text-white";
    return (
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-extrabold text-sm ${color} shadow-sm shrink-0`}>
        {rating}
      </div>
    );
  };

  const getRiskBadge = (risk: "Minimal" | "Moderate" | "Major" | "Severe") => {
    switch (risk) {
      case "Minimal":
        return <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">Minimal Risk</span>;
      case "Moderate":
        return <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">Moderate Risk</span>;
      case "Major":
      case "Severe":
        return <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">Severe Risk</span>;
    }
  };

  return (
    <div id="neighborhood" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
      {/* Section Title */}
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-xl font-bold text-slate-950 tracking-tight">Neighborhood & School Intelligence</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified school boundary metrics, transit connectivity indices, and climate factor risks for {property.location.locality}, {property.location.city}.
        </p>
      </div>

      {/* 1. GreatSchools Rating Block */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-base">Assigned & Nearby Schools</h4>
          </div>
          <span className="text-[11px] text-slate-400">GreatSchools Rating Guide</span>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
          {schools.length > 0 ? (
            schools.map((school, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3.5">
                  {getRatingBadge(school.rating)}
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{school.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Grades: <span className="font-medium text-slate-700">{school.grades}</span> • Type: <span className="font-medium text-slate-700">{school.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-800">{school.distance}</div>
                  <div className="text-[11px] text-slate-400">distance</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-xs text-slate-500">School ratings data pending district audit.</div>
          )}
        </div>
      </div>

      {/* 2. Walk Score, Transit Score, Bike Score */}
      {scores && (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 text-base">Mobility & Walkability Scores</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Walk Score */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  <Footprints className="h-4 w-4 text-emerald-600" /> Walk Score®
                </div>
                <span className={`px-2 py-0.5 rounded-md font-extrabold text-sm border ${getScoreColor(scores.walkScore)}`}>
                  {scores.walkScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {scores.walkDescription}
              </p>
            </div>

            {/* Transit Score */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  <Bus className="h-4 w-4 text-teal-600" /> Transit Score®
                </div>
                <span className={`px-2 py-0.5 rounded-md font-extrabold text-sm border ${getScoreColor(scores.transitScore)}`}>
                  {scores.transitScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {scores.transitDescription}
              </p>
            </div>

            {/* Bike Score */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  <Bike className="h-4 w-4 text-indigo-600" /> Bike Score®
                </div>
                <span className={`px-2 py-0.5 rounded-md font-extrabold text-sm border ${getScoreColor(scores.bikeScore)}`}>
                  {scores.bikeScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {scores.bikeDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Climate & Environmental Risk Indicators */}
      {climate && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-slate-700" />
            <h4 className="font-bold text-slate-900 text-base">Climate & Environmental Risk Factor</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CloudRain className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold text-slate-700">Flood Factor</span>
              </div>
              {getRiskBadge(climate.floodRisk)}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Flame className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-700">Fire Factor</span>
              </div>
              {getRiskBadge(climate.fireRisk)}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <SunMedium className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-semibold text-slate-700">Heat Stress</span>
              </div>
              {getRiskBadge(climate.heatRisk)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
