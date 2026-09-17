import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useAuth } from "./AuthContext";
import { Button } from "../components/ui/Button";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { loading, isConfigured, signInWithGoogle, signInWithEmail, createAccount } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "signin") await signInWithEmail(email, password);
      else await createAccount(email, password);
      onSuccess();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to authenticate right now.");
    }
  };

  const continueWithGoogle = async () => {
    setError("");
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google sign-in failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{mode === "signin" ? "Sign in to continue" : "Create your account"}</h2>
            <p className="mt-1 text-sm text-slate-500">Authenticate securely with Firebase to open your workspace.</p>
          </div>
          <button aria-label="Close sign in" onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="h-5 w-5" /></button>
        </div>
        {!isConfigured ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Firebase is not configured. Add the VITE_FIREBASE_* variables to .env.local.</p>
        ) : (
          <>
            <button onClick={() => void continueWithGoogle()} className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">Continue with Google</button>
            <div className="my-5 flex items-center gap-3 text-xs text-slate-400"><div className="h-px flex-1 bg-slate-200" />OR<div className="h-px flex-1 bg-slate-200" /></div>
            <form onSubmit={submit} className="space-y-3">
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500" />
              <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password (6+ characters)" className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>{mode === "signin" ? "Sign In" : "Create Account"}</Button>
            </form>
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }} className="mt-4 w-full text-center text-sm text-emerald-700 hover:underline">{mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}</button>
          </>
        )}
      </div>
    </div>
  );
}