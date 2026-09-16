import { ArrowRight, Building2, Home, KeyRound, LineChart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import type { Role } from "../types";
import { useAuth } from "../auth/AuthContext";
import { AuthModal } from "../auth/AuthModal";

const roleOptions: Array<{
  role: Role;
  title: string;
  description: string;
  icon: typeof Home;
  destination: string;
}> = [
  {
    role: "BUYER",
    title: "I am buying or renting",
    description: "Discover properties, compare options, and find your next address.",
    icon: Home,
    destination: "/app",
  },
  {
    role: "AGENT",
    title: "I am an agent",
    description: "Manage listings, respond to leads, and keep your pipeline moving.",
    icon: Users,
    destination: "/dashboard/agent",
  },
  {
    role: "LANDLORD",
    title: "I am a landlord",
    description: "Stay on top of your portfolio, properties, and maintenance requests.",
    icon: Building2,
    destination: "/dashboard/landlord",
  },
  {
    role: "TENANT",
    title: "I am a tenant",
    description: "Access your lease, payments, and support in one simple workspace.",
    icon: KeyRound,
    destination: "/dashboard/tenant",
  },
];

export function Landing() {
  const navigate = useNavigate();
  const setRole = useStore((state) => state.setRole);
  const { user } = useAuth();
  const [pendingRole, setPendingRole] = useState<{ role: Role; destination: string } | null>(null);

  useEffect(() => {
    if (user && pendingRole) {
      navigate(pendingRole.destination);
      setPendingRole(null);
    }
  }, [navigate, pendingRole, user]);

  const enterWorkspace = (role: Role, destination: string) => {
    setRole(role);
    navigate(destination);
  };

  const finishAuthentication = () => {
    if (!pendingRole) return;
    setRole(pendingRole.role);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f7f2] text-slate-900">
      <section className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-between px-6 py-8 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700">
            <Building2 className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight text-slate-950">EstateIQ</span>
          </div>
          <button onClick={() => navigate("/app")} className="hidden items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-700 sm:flex">
            Explore properties <ArrowRight className="h-4 w-4" />
          </button>
        </header>

        <div className="grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <LineChart className="h-3.5 w-3.5" /> Property intelligence, made personal
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-7xl">
              Your next move starts here.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-slate-600">
              EstateIQ brings the entire property journey into one calm, intelligent workspace, from the first search to the final key handover.
            </p>
          </div>

          <div className="relative min-h-[270px] overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-emerald-950/10 sm:min-h-[340px]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.8),transparent_48%),linear-gradient(315deg,rgba(15,23,42,0.2),rgba(15,23,42,0.9))]" />
            <div className="relative flex h-full min-h-[254px] flex-col justify-between">
              <div className="flex items-center justify-between text-sm text-emerald-100">
                <span>ESTATEIQ / 01</span>
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-200">A clearer view of real estate</p>
                <p className="mt-2 max-w-sm text-3xl font-semibold leading-tight">Make decisions with more confidence.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Choose your workspace</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Where should we take you?</h2>
            </div>
            <span className="hidden text-sm text-slate-500 sm:block">You can change this later</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roleOptions.map(({ role, title, description, icon: Icon, destination }) => (
              <button key={role} onClick={() => enterWorkspace(role, destination)} className="group flex min-h-44 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/10">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
                </div>
                <span>
                  <span className="block font-semibold text-slate-900">{title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-500">{description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {pendingRole && <AuthModal onClose={() => setPendingRole(null)} onSuccess={finishAuthentication} />}
    </main>
  );
}