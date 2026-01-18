import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSplash from "./components/LoadingSplash";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./Pages/ProfilePage";
import MessagesPage from "./Pages/MessagesPage";
import { AuthProvider } from "./context/Authcontext";
import AdminLogin from "./Admin/AdminLogin.jsx";
import "./index.css";
import AdminLayout from "./Admin/AdminLayout.jsx";

// Debug helper
window.addEventListener("error", (event) => {
  console.log("🔥 Hook Error Source:", event.filename, event.lineno);
});

/**
 * Global app load manager
 * Tracks loading tasks and coordinates splash screen hiding
 */
if (!window.appLoadManager) {
  window.appLoadManager = (function () {
    const tasks = new Set();
    const listeners = new Set();

    function notify() {
      const count = tasks.size;
      console.log(`📊 AppLoadManager: ${count} tasks pending`, Array.from(tasks));
      listeners.forEach((l) => {
        try {
          l(count);
        } catch (e) {
          console.error("appLoadManager listener error", e);
        }
      });
    }

    return {
      addTask(id) {
        if (!id) return;
        if (!tasks.has(id)) {
          console.log(`➕ Task added: ${id}`);
          tasks.add(id);
          notify();
        }
      },
      completeTask(id) {
        if (!id) return;
        if (tasks.delete(id)) {
          console.log(`✅ Task completed: ${id}`);
          notify();
        }
      },
      removeTask(id) {
        if (!id) return;
        if (tasks.delete(id)) {
          console.log(`❌ Task removed: ${id}`);
          notify();
        }
      },
      pendingCount() {
        return tasks.size;
      },
      onChange(cb) {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
      whenReady(timeoutMs = 20000) {
        return new Promise((resolve) => {
          if (tasks.size === 0) return resolve(true);
          let unsub = null;
          const timer = setTimeout(() => {
            if (unsub) unsub();
            console.warn("⏰ AppLoadManager timeout reached");
            resolve(false);
          }, timeoutMs);
          unsub = this.onChange((count) => {
            if (count === 0) {
              clearTimeout(timer);
              if (unsub) unsub();
              console.log("🎉 All tasks complete!");
              resolve(true);
            }
          });
        });
      },
    };
  })();
}

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <LoadingSplash>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />} />
            </Route>
          </Routes>
        </LoadingSplash>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
