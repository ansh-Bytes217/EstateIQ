"use client";
import { AuthModal } from "@/src/auth/AuthModal";
import { useRouter } from "next/navigation";
export default function LoginPage() { const router = useRouter(); return <div className="min-h-screen bg-slate-950"><AuthModal onClose={() => router.push("/")} onSuccess={() => router.push("/app")} /></div>; }