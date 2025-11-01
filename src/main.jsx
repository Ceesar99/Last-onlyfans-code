import React from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

function SafeImport({ name, importer }) {
  try {
    const Comp = importer();
    return (
      <div style={{ color: "green", padding: "1rem", textAlign: "center" }}>
        ✅ {name} imported successfully.
      </div>
    );
  } catch (err) {
    return (
      <div style={{ color: "red", padding: "1rem", textAlign: "center" }}>
        ❌ Error importing {name}: {err.message}
      </div>
    );
  }
}

function TestImports() {
  return (
    <div style={{ fontFamily: "monospace", marginTop: "2rem" }}>
      <SafeImport name="LoadingSplash" importer={() => require("./components/LoadingSplash")} />
      <SafeImport name="AuthProvider" importer={() => require("./context/Authcontext")} />
      <SafeImport name="ProfilePage" importer={() => require("./Pages/ProfilePage")} />
      <SafeImport name="MessagesPage" importer={() => require("./Pages/MessagesPage")} />
      <SafeImport name="AdminLogin" importer={() => require("./Admin/AdminLogin.jsx")} />
      <SafeImport name="AdminLayout" importer={() => require("./Admin/AdminLayout.jsx")} />
      <SafeImport name="ProtectedRoute" importer={() => require("./components/ProtectedRoute")} />
    </div>
  );
}

root.render(
  <React.StrictMode>
    <TestImports />
  </React.StrictMode>
);
