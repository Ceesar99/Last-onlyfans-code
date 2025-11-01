import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSplash from "./components/LoadingSplash";
import { AuthProvider } from "./context/Authcontext";
import AdminLogin from "./Admin/AdminLogin";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LoadingSplash>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLogin />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingSplash>
  </React.StrictMode>
);
