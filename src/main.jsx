import React from "react";
import { createRoot } from "react-dom/client";
import LoadingSplash from "./components/LoadingSplash"; // 👈 first import

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <LoadingSplash />
  </React.StrictMode>
);
