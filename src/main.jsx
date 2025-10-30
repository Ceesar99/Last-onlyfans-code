import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./Pages/ProfilePage";
import MessagesPage from "./Pages/MessagesPage";
import { AuthProvider } from "./context/Authcontext";
import AdminLogin from "./Admin/AdminLogin.jsx";
import "./index.css";
import AdminLayout from "./Admin/AdminLayout.jsx";

// Splash Loader Component
function AppLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash animation: 2.5 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    // Full load: assume up to 5 seconds total, then hide
    const loadTimer = setTimeout(() => setLoading(false), 5000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        {showSplash ? (
          <div className="animate-breathe">
            {/* Animated Splash Logo - Full OF with wing (based on your first image; adjust path if needed) */}
            <svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="20" fill="#00aff0" />
              <path d="M30 15 L45 5 L60 15" fill="none" stroke="#fff" strokeWidth="4" /> {/* Wing example */}
              <text x="60" y="32" fontSize="25" fill="#00aff0">OnlyFans</text>
            </svg>
          </div>
        ) : (
          <div className="animate-spin">
            {/* Loading Spinner - Dotted circle (based on your second image; adjust if needed) */}
            <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="20" stroke="#ccc" strokeWidth="5" fill="none" strokeDasharray="20,10" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  return children;
}

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppLoader>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />} />
            </Route>
          </Routes>
        </AppLoader>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
