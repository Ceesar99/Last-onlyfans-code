import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/Authcontext"; // 👈 second import
import LoadingSplash from "./components/LoadingSplash";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingSplash />
    </AuthProvider>
  </React.StrictMode>
);
