import React from "react";
import { createRoot } from "react-dom/client";
import LoadingSplash from "./components/LoadingSplash";

const root = createRoot(document.getElementById("root"));
root.render(<LoadingSplash />);
