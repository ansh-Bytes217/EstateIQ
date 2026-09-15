import React from "react";
import { Search, LineChart, LayoutList, CheckCircle2 } from "lucide-react";

export const WhyEstateIQ = () => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Why choose EstateIQ?
          </h2>
          <p className="text-lg text-slate-600">
            An enterprise-grade platform designed to simplify the entire real estate journey from discovery to closing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Search,
              title: "Better Discovery",
              desc: "Explore properties through powerful search, advanced filters, and interactive maps.",
            },
            {
              icon: LineChart,
              title: "Property Intelligence",
              desc: "Understand pricing, historical trends, and neighborhood activity with data.",
            },
            {
              icon: LayoutList,
              title: "Simplified Decisions",
              desc: "Compare properties side-by-side and organize your shortlist easily.",
            },
            {
              icon: CheckCircle2,
              title: "Complete Journey",
              desc: "Seamless workflows from discovery to inquiry, viewing, and making offers.",
            }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6">
              <div className="h-16 w-16 bg-slate-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
