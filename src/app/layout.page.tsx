import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./AppProviders";
export const metadata: Metadata = { title: "EstateIQ | Intelligent real estate", description: "An AI-native workspace for buying, selling, renting, and understanding property." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><AppProviders>{children}</AppProviders></body></html>; }