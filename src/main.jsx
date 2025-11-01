import React from "react";
import { createRoot } from "react-dom/client";

function Test() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Step 1 ✅ React + Root works</h1>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Test />);
