import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSplash from "./components/LoadingSplash";
import { AuthProvider } from "./context/Authcontext";
import AdminLayout from "./Admin/AdminLayout";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LoadingSplash>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLayout />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingSplash>
  </React.StrictMode>
);
