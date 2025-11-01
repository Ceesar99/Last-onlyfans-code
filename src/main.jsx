import React from "react";
import ReactDOM from "react-dom/client";

function Main() {
  return (
    <div style={{ color: "black", textAlign: "center", marginTop: "50px" }}>
      🧠 Main component loaded successfully!
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
