import React from "react";
import { createRoot } from "react-dom/client";

let SafeApp;

try {
  // Import one small component at a time
  SafeApp = require("./components/LoadingSplash").default;
} catch (err) {
  SafeApp = () => (
    <div style={{ color: "red", marginTop: "40px", textAlign: "center" }}>
      ❌ Error importing LoadingSplash:
      <pre style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
        {err.message}
      </pre>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <SafeApp />
  </React.StrictMode>
);
