import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSplash from "./components/LoadingSplash";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./Pages/ProfilePage";
import MessagesPage from "./Pages/MessagesPage";
import { AuthProvider } from "./context/Authcontext";
import AdminLogin from "./Admin/AdminLogin.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";
import "./index.css";

function DebugBoundary({ name, children }) {
  try {
    return children;
  } catch (error) {
    return (
      <div style={{ color: "red", padding: "20px", textAlign: "center" }}>
        ❌ <b>{name}</b> component crashed: {error.message}
      </div>
    );
  }
}

function DebugApp() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>
        🧩 Component Loading Test
      </h2>

      <DebugBoundary name="LoadingSplash">
        <LoadingSplash>
          <DebugBoundary name="AuthProvider">
            <AuthProvider>
              <DebugBoundary name="BrowserRouter">
                <BrowserRouter>
                  <DebugBoundary name="Routes">
                    <Routes>
                      <Route path="/" element={<ProfilePage />} />
                      <Route path="/messages" element={<MessagesPage />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminLayout />} />
                      </Route>
                    </Routes>
                  </DebugBoundary>
                </BrowserRouter>
              </DebugBoundary>
            </AuthProvider>
          </DebugBoundary>
        </LoadingSplash>
      </DebugBoundary>

      <p style={{ marginTop: "40px", textAlign: "center", color: "#555" }}>
        If screen goes blank or shows an error above, that’s your broken
        component.
      </p>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DebugApp />
  </React.StrictMode>
);
