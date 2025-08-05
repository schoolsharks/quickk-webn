import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const ReviewCard: React.FC = () => {
  return (
    <Card
      sx={{
        background: "#000000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius:0,
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Top: Title and icon */}
      <CardContent sx={{ textAlign: "center", pt: 2, pb: 0,justifyItems:"space-between" ,display:"flex",flexDirection:"column" }}>
        <Typography
          variant="h4"
          sx={{ mb: 2, textAlign: "left" }}
        >
          Quickk AI
        </Typography>
        <svg
          width={200}
          height={200}
          viewBox="0 0 24 24"
          style={{ display: "block", margin: "0 auto" }}
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
              animation: "draw-circle 0.7s ease forwards"
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
              animation: "draw-tick 0.7s 0.7s ease forwards"
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

        {/* Bottom: Module label */}
        <Box
          sx={{
            bgcolor: "#404040",
            p: "15px",
            textAlign: "left",
            mt:5
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "16px", color: "#ccc" }}>
            POSH Training Module
          </Typography>
          <Typography variant="body2" sx={{ color: "primary.main" }}>
            Ready to Review
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
