console.log("✅ main.jsx started running");
import React from "react";
document.body.innerHTML = "<h2 style='color:red;text-align:center;margin-top:40px'>Loading React App...</h2>";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import LoadingSplash from "./components/LoadingSplash";  // ✅ Clean import
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./Pages/ProfilePage";
import MessagesPage from "./Pages/MessagesPage";
import { AuthProvider } from "./context/Authcontext";
import AdminLogin from "./Admin/AdminLogin.jsx";
import "./index.css";
import AdminLayout from "./Admin/AdminLayout.jsx";

// Debug helper (unchanged)
window.addEventListener("error", (event) => {
  console.log("🔥 Hook Error Source:", event.filename, event.lineno);
});

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LoadingSplash>  {/* ✅ Splash wraps EVERYTHING */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingSplash>
  </React.StrictMode>
);
