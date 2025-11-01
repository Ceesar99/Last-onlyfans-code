import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            color: "#111",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h1 style={{ color: "red", fontSize: "22px", fontWeight: "bold" }}>
            ⚠️ Something went wrong
          </h1>
          <p style={{ marginTop: "10px" }}>
            An unexpected error occurred in this app.
          </p>
          <p
            style={{
              backgroundColor: "#f4f4f4",
              padding: "8px 12px",
              borderRadius: "8px",
              marginTop: "10px",
              fontSize: "13px",
              color: "#555",
              wordBreak: "break-word",
            }}
          >
            {this.state.error?.message || "Unknown error"}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              backgroundColor: "#00AFF0",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
