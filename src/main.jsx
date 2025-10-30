import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./Pages/ProfilePage";
import MessagesPage from "./Pages/MessagesPage";
import { AuthProvider } from "./context/Authcontext";
import AdminLogin from "./Admin/AdminLogin.jsx";
import "./index.css";
import AdminLayout from "./Admin/AdminLayout.jsx";

// Debug helper to detect invalid hook source
window.addEventListener("error", (event) => {
                                console.log("🔥 Hook Error Source:", event.filename, event.lineno);
});

const root = createRoot(document.getElementById("root"));

root.render(
                                <React.StrictMode>
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
                                </React.StrictMode>
);
