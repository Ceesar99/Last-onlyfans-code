// components/LoadingSplash.jsx
import React, { useState, useEffect } from "react";

const LoadingSplash = ({ children }) => {
  const [stage, setStage] = useState("logo");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const logoTime = Math.random() * 2000 + 3000;
    const logoTimer = setTimeout(() => {
      setStage("spinner");
      const spinnerTime = Math.random() * 1000 + 2000;
      const spinnerTimer = setTimeout(() => {
        setIsVisible(false);
        setStage("done");
      }, spinnerTime);
      return () => clearTimeout(spinnerTimer);
    }, logoTime);
    return () => clearTimeout(logoTimer);
  }, []);

  if (!isVisible) return children;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        transition: "opacity 0.5s ease",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {stage === "logo" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="91"
          height="150"
          viewBox="0 0 91 150"
          style={{
            width: "200px",
            height: "330px",
            animation:
              "breathe 1.6s ease-in-out infinite, fadeIn 1s ease-out forwards",
          }}
        >
          <path
            d="M35.6,8.5c-0.5,0.4-1.3,0.4-1.8-0.1L9.4,0.1C8.9-0.2,8.4,0.2,8.4,0.7v40.8c0,0.5,0.4,1,0.9,1.1l24.4,8.3
            c0.5,0.2,1.1-0.1,1.1-0.7V8.5z M36.8,4.3v41.2c0,0.6-0.4,1.1-0.9,1.3L10,55.5c-0.7,0.2-1.4-0.3-1.4-1V3.3c0-0.6,0.5-1.1,1.1-1.2
            l25.8-2.2C36.2-0.2,36.8,0.7,36.8,4.3z"
            fill="#000000"
          />
        </svg>
      )}

      {stage === "spinner" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="294"
          height="334"
          viewBox="0 0 294 334"
          style={{
            width: "200px",
            height: "330px",
            animation: "spin 2s linear infinite",
            transformOrigin: "center center",
            transformBox: "fill-box",
          }}
        >
          <g id="images">
            <path
              d="M157.488,143.905C155.637,141.975,156.436,138.910,158.912,138.446C160.203,138.204,161.041,138.475,162.017,139.450C162.663,140.096,162.858,140.503,162.858,141.208C162.858,143.241,161.492,144.616,159.473,144.616C158.371,144.616,158.064,144.506,157.488,143.905"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
            <path
              d="M167.184,166.317C166.863,166.256,166.112,165.734,165.514,165.157C163.654,163.363,163.704,161.095,165.642,159.346C166.542,158.533,166.773,158.449,168.107,158.449C169.334,158.449,169.747,158.571,170.595,159.185C172.626,160.655,172.853,163.154,171.133,165.111C170.143,166.238,168.845,166.634,167.184,166.317"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
            <path
              d="M157.842,187.449C157.367,187.199,156.631,186.560,156.205,186.028C155.531,185.185,155.432,184.864,155.432,183.513C155.432,181.631,156.107,180.513,157.673,179.803C159.114,179.149,160.458,179.198,161.744,179.950C163.158,180.778,163.865,181.950,163.865,183.465C163.865,185.903,162.325,187.636,160.008,187.807C159.088,187.874,158.451,187.769,157.842,187.449"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
            <path
              d="M136.554,196.535C134.715,195.581,133.659,193.940,133.659,192.037C133.659,190.702,134.059,189.803,135.084,188.834C136.021,187.948,136.934,187.623,138.487,187.623C143.166,187.623,144.946,193.702,140.999,196.203C139.670,197.045,137.807,197.184,136.554,196.535"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
            <path
              d="M114.880,188.064C111.755,185.963,111.103,182.458,113.358,179.891C115.470,177.488,118.962,177.441,121.308,179.786C123.131,181.607,123.517,183.782,122.407,185.980C121.433,187.909,119.819,188.881,117.588,188.881C116.322,188.881,115.912,188.757,114.880,188.064"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
            <path
              d="M106.547,167.984C105.314,167.374,103.809,165.800,103.303,164.591C103.109,164.127,102.953,163.149,102.956,162.418C102.973,158.337,107.248,155.508,110.896,157.164C113.421,158.310,114.955,160.711,114.706,163.126C114.546,164.675,114.080,165.650,112.969,166.760C111.232,168.495,108.596,168.998,106.547,167.984"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
            <path
              d="M115.410,147.415C114.229,146.876,112.378,144.950,111.867,143.729C111.400,142.612,111.409,140.388,111.886,139.249C113.107,136.328,116.176,134.802,119.113,135.656C123.595,136.957,125.275,142.035,122.450,145.735C120.981,147.660,117.675,148.449,115.410,147.415"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
            <path
              d="M137.057,139.853C133.683,139.029,131.134,135.638,131.466,132.418C131.839,128.812,134.646,126.219,138.202,126.197C140.235,126.184,141.794,126.839,143.290,128.334C146.082,131.123,145.904,135.587,142.896,138.233C141.179,139.743,139.038,140.337,137.057,139.853"
              stroke="#D1D2D4"
              fill="#D1D2D4"
              strokeWidth="1"
            />
          </g>
        </svg>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingSplash;
