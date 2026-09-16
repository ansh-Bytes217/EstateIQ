/// <reference types="vite/client" />

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const nodeEnv = (typeof process !== "undefined" && process?.env ? process.env : {}) as Record<string, string | undefined>;
const viteEnv = (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {}) as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: viteEnv.VITE_FIREBASE_API_KEY || nodeEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: viteEnv.VITE_FIREBASE_AUTH_DOMAIN || nodeEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: viteEnv.VITE_FIREBASE_PROJECT_ID || nodeEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: viteEnv.VITE_FIREBASE_STORAGE_BUCKET || nodeEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || nodeEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: viteEnv.VITE_FIREBASE_APP_ID || nodeEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = app ? getAuth(app) : null;