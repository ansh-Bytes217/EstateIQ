"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/src/auth/AuthContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
