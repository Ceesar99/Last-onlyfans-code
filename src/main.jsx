import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

function SafeImport({ name, path }) {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    import(path)
      .then(() => setStatus("ok"))
      .catch((err) => {
        console.error(`❌ Error importing ${name}:`, err);
        setError(err.message);
        setStatus("error");
      });
  }, [name, path]);

  if (status === "loading") return <p>⏳ Checking {name}...</p>;
  if (status === "ok")
    return <p style={{ color: "green" }}>✅ {name} imported successfully.</p>;
  return (
    <p style={{ color: "red" }}>
      ❌ Error importing {name}: {error}
    </p>
  );
}

function TestImports() {
  return (
    <div style={{ fontFamily: "monospace", padding: "1rem" }}>
      <h2>🔍 Component Import Check</h2>
      <SafeImport name="LoadingSplash" path="./components/LoadingSplash.jsx" />
      <SafeImport name="AuthProvider" path="./context/Authcontext.jsx" />
      <SafeImport name="ProfilePage" path="./Pages/ProfilePage.jsx" />
      <SafeImport name="MessagesPage" path="./Pages/MessagesPage.jsx" />
      <SafeImport name="AdminLogin" path="./Admin/AdminLogin.jsx" />
      <SafeImport name="AdminLayout" path="./Admin/AdminLayout.jsx" />
      <SafeImport name="ProtectedRoute" path="./components/ProtectedRoute.jsx" />
    </div>
  );
}

root.render(
  <React.StrictMode>
    <TestImports />
  </React.StrictMode>
);
