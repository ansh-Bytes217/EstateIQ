import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { Building2, Search, Heart, User as UserIcon, LayoutDashboard, LogOut, X } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../auth/AuthContext";

export const Navbar = () => {
  const { role, setRole, savedPropertyIds, currency, setCurrency } = useStore();
  const navigate = useNavigate();
  const { user, loading: authLoading, isConfigured, signInWithGoogle, signInWithEmail, createAccount, logOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError("");
    try {
      if (authMode === "signin") await signInWithEmail(email, password);
      else await createAccount(email, password);
      setAuthOpen(false);
      setPassword("");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to authenticate right now.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-emerald-600">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-slate-900">EstateIQ</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/search" className="hover:text-emerald-600 transition-colors">Buy</Link>
            <Link to="/search?type=rent" className="hover:text-emerald-600 transition-colors">Rent</Link>
            <Link to="/search?type=commercial" className="hover:text-emerald-600 transition-colors">Commercial</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            className="hidden sm:flex items-center justify-center h-8 px-3 rounded-full bg-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            {currency}
          </button>

          <Link to="/search">
            <Button variant="ghost" size="sm" className="hidden sm:flex px-2">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </Link>
          
          <Link to="/saved" className="relative text-slate-600 hover:text-emerald-600 transition-colors">
            <Heart className="h-5 w-5" />
            {savedPropertyIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">
                {savedPropertyIds.length}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          <div className="relative group">
            <Button variant="outline" size="sm" className="gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.displayName || user?.email || role}</span>
            </Button>
            
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
              <div className="p-2 flex flex-col gap-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Switch Role</div>
                {(["BUYER", "AGENT", "LANDLORD", "TENANT"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      if (r !== "BUYER") {
                        navigate(`/dashboard/${r.toLowerCase()}`);
                      }
                    }}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${role === r ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-700 hover:bg-slate-100"}`}
                  >
                    {r}
                  </button>
                ))}
                <div className="h-px bg-slate-200 my-1"></div>
                {role !== "BUYER" && (
                  <Link to={`/dashboard/${role.toLowerCase()}`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
                {user ? (
                  <button onClick={() => void logOut()} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                ) : (
                  <button onClick={() => setAuthOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 rounded-md">
                    <UserIcon className="h-4 w-4" /> Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {authOpen && !user && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={() => setAuthOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{authMode === "signin" ? "Welcome back" : "Create your account"}</h2>
                <p className="mt-1 text-sm text-slate-500">Save properties and personalize your EstateIQ experience.</p>
              </div>
              <button aria-label="Close sign in" onClick={() => setAuthOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            {!isConfigured ? (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Firebase is not configured. Add your Firebase web app values as `VITE_FIREBASE_*` variables in `.env.local`.</p>
            ) : (
              <>
                <button onClick={() => void signInWithGoogle().catch((error) => setAuthError(error instanceof Error ? error.message : "Google sign-in failed."))} className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">Continue with Google</button>
                <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><div className="h-px flex-1 bg-slate-200" />OR<div className="h-px flex-1 bg-slate-200" /></div>
                <form onSubmit={submitAuth} className="space-y-3">
                  <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500" />
                  <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (6+ characters)" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500" />
                  {authError && <p className="text-sm text-red-600">{authError}</p>}
                  <Button type="submit" className="w-full" disabled={authLoading}>{authMode === "signin" ? "Sign In" : "Create Account"}</Button>
                </form>
                <button onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setAuthError(""); }} className="mt-4 w-full text-center text-sm text-emerald-700 hover:underline">{authMode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
