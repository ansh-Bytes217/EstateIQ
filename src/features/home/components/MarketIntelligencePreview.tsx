import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowUpRight, BarChart3, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockTrendData = [
  { name: 'Jan', value: 4800 },
  { name: 'Feb', value: 4950 },
  { name: 'Mar', value: 4900 },
  { name: 'Apr', value: 5100 },
  { name: 'May', value: 5050 },
  { name: 'Jun', value: 5200 },
];

export const MarketIntelligencePreview = () => {
  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Content */}
          <div className="lg:w-1/2 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-sm font-semibold mb-6">
                <BarChart3 className="h-4 w-4" /> EstateIQ Intelligence
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                Data-driven property decisions
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                EstateIQ isn't just a listing platform. We provide deep market intelligence, historical price trends, and accurate valuations to help you invest with confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-sm font-medium text-slate-500 mb-2">Median Price (Ahmedabad)</div>
                <div className="text-2xl font-bold text-slate-900">₹5,200 <span className="text-sm font-normal text-slate-500">/sqft</span></div>
                <div className="flex items-center text-sm font-medium text-emerald-600 mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" /> +7.2% YoY
                </div>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="text-sm font-medium text-slate-500 mb-2">Avg. Rental Yield</div>
                <div className="text-2xl font-bold text-slate-900">4.8%</div>
                <div className="flex items-center text-sm font-medium text-emerald-600 mt-2">
                  <ArrowUpRight className="h-4 w-4 mr-1" /> Strong Demand
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart/Visuals */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-slate-900">Price Trend Analysis</h3>
                  <p className="text-sm text-slate-500">6-month moving average</p>
                </div>
                <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTrendData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₹${value}`} dx={-10} domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip 
                      contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      formatter={(value: number) => [`₹${value}/sqft`, 'Price']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} dot={{r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
