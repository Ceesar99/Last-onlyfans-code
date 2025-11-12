// components/LoadingSplash.jsx
import React, { useState, useEffect } from "react";

const LoadingSplash = ({ children }) => {
  const [showLogo, setShowLogo] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      setShowSpinner(true);
    }, 1500); // logo visible for ~1.5s

    const spinnerTimer = setTimeout(() => {
      setShowSpinner(false);
      setShowContent(true);
    }, 3000); // spinner visible for ~1.5s after logo

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(spinnerTimer);
    };
  }, []);

  if (!showContent) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        {showLogo && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "breathing 2s ease-in-out infinite",
            }}
          >
            {/* Replace this SVG with your logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#007bff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        )}

        {showSpinner && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                border: "4px solid #e0e0e0",
                borderTop: "4px solid #007bff",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes breathing {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingSplash;
