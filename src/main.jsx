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
import ErrorBoundary from "./components/ErrorBoundary";  // Add this import

// Debug helper to detect invalid hook source
window.addEventListener("error", (event) => {
  console.log("🔥 Hook Error Source:", event.filename, event.lineno);
});

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>  // Wrap here
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
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (e) {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.innerHTML = `<h1>Error: ${e.message}</h1><pre>${e.stack}</pre>`;
  rootElement.appendChild(errorDiv);
}
