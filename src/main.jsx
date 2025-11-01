import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSplash from "./components/LoadingSplash";
import { AuthProvider } from "./context/Authcontext";
import MessagesPage from "./Pages/MessagesPage";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LoadingSplash>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MessagesPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingSplash>
  </React.StrictMode>
);
