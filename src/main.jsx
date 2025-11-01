import React from "react";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(
  <h1 style={{ textAlign: "center", marginTop: "50px", color: "green" }}>
    ✅ React root is rendering fine.
  </h1>
);
