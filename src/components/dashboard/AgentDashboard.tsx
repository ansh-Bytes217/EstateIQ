import React from "react";
import { useStore } from "../../store/useStore";
import { Users, Eye, TrendingUp, Calendar, ArrowUpRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const AgentDashboard = () => {
  const { role } = useStore();

  if (role !== "AGENT") return <div>Unauthorized</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Sarah</h1>
          <p className="text-slate-500">Here's what's happening with your properties today.</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
          + Create New Listing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Listings", value: "24", icon: TrendingUp, trend: "+12%" },
          { title: "Total Views", value: "8,432", icon: Eye, trend: "+5.4%" },
          { title: "New Inquiries", value: "12", icon: Users, trend: "+2 this week" },
          { title: "Viewings Today", value: "3", icon: Calendar, trend: "View schedule" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Michael Chen", prop: "Skyline Luxury Penthouse", time: "2 hours ago", status: "New" },
                { name: "Emma Watson", prop: "Boutique Garden Appt", time: "5 hours ago", status: "Replied" },
                { name: "David Miller", prop: "Skyline Luxury Penthouse", time: "Yesterday", status: "Viewing Scheduled" },
              ].map((inq, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                      {inq.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{inq.name}</div>
                      <div className="text-sm text-slate-500">Interested in {inq.prop}</div>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-emerald-600 mb-1">{inq.status}</div>
                    <div className="text-xs text-slate-400 flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" /> {inq.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {[
                { time: "10:00 AM", event: "Viewing: Serene Villa", client: "Rajesh K." },
                { time: "01:30 PM", event: "Key Handover", client: "Apt 4B" },
                { time: "04:00 PM", event: "Viewing: Penthouse", client: "Anita M." },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-slate-900">{item.event}</div>
                      <time className="text-xs font-medium text-emerald-600">{item.time}</time>
                    </div>
                    <div className="text-slate-500 text-sm">Client: {item.client}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
