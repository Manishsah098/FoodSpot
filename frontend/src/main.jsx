import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import './index.css'
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import FoodContextProvider from "./context/FoodContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

// One-time migration: clear the old hardcoded default 'Manish Sah' user
// so existing browsers start fresh as guests
const MIGRATION_KEY = "foodspot_v2_migrated";
if (!localStorage.getItem(MIGRATION_KEY)) {
  try {
    const stored = localStorage.getItem("foodspot_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.email === "manish.sah@example.com") {
        localStorage.removeItem("foodspot_user");
      }
    }
  } catch (_) {}
  localStorage.setItem(MIGRATION_KEY, "true");
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <FoodContextProvider>
        <App />
      </FoodContextProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);