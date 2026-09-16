import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "./firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const requireAuth = () => {
    if (!firebaseAuth) {
      throw new Error("Firebase is not configured. Add the VITE_FIREBASE_* variables to .env.local.");
    }
    return firebaseAuth;
  };

  const value: AuthContextValue = {
    user,
    loading,
    isConfigured: isFirebaseConfigured,
    signInWithGoogle: async () => {
      await signInWithPopup(requireAuth(), new GoogleAuthProvider());
    },
    signInWithEmail: async (email, password) => {
      await signInWithEmailAndPassword(requireAuth(), email, password);
    },
    createAccount: async (email, password) => {
      await createUserWithEmailAndPassword(requireAuth(), email, password);
    },
    logOut: async () => {
      await signOut(requireAuth());
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}