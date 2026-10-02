import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebasePublicConfig } from "./firebase-public";

export function shopAuth() {
  const app = getApps().length ? getApp() : initializeApp(firebasePublicConfig);
  return getAuth(app);
}
