import React from "react";

const CheckCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={200}
    height={200}
    viewBox="0 0 24 24"
    style={{ display: "block", margin: "0 auto" }}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="#96FF43"
      strokeWidth="2"
      fill="none"
      style={{
        strokeDasharray: 62.8,
        strokeDashoffset: 62.8,
        animation: "draw-circle 0.7s ease forwards",
      }}
    />
    <polyline
      points="9 12.5 11.5 15 16 10"
      fill="none"
      stroke="#96FF43"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 24,
        strokeDashoffset: 24,
        animation: "draw-tick 0.7s 0.7s ease forwards",
      }}
    />
    <style>
      {`
                @keyframes draw-circle {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes draw-tick {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}
    </style>
  </svg>
);

export default CheckCircle;
