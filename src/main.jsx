import React from "react";
import { createRoot } from "react-dom/client";
import ProfilePage from "./Pages/ProfilePage";
import { AuthProvider } from "./context/Authcontext";
import LoadingSplash from "./components/LoadingSplash";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingSplash>
        <ProfilePage />
      </LoadingSplash>
    </AuthProvider>
  </React.StrictMode>
);
