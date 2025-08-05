import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { Feature } from "../api/onboardingApi";
import QuickkAi from "../assets/Quickk-Ai.png";

interface FeatureCardProps {
  feature: Feature;
  isSelected: boolean;
  onToggle: (featureId: string) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  isSelected,
  onToggle,
}) => {
  return (
    <Card
      sx={{
        backgroundColor: isSelected ? "#96FF43" : "#333",
        color: isSelected ? "black" : "white",
        cursor: "pointer",
        border: isSelected ? "2px solid #96FF43" : "2px solid #444",
        borderRadius: 0,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: isSelected ? "#7BD932" : "#444",
          transform: "translateY(-2px)",
        },
        height: "100%",
      }}
      onClick={() => onToggle(feature._id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          {/* Icon instead of image */}
          <Box sx={{ mr: 2, mt: 0.5 }}>
            <Box
              component="img"
              src={QuickkAi}
              alt=""
              sx={{
                width: 80,
                height: 80,
                objectFit: "contain",
                borderRadius: "50%",
                background: isSelected ? "#eaffd6" : "#222",
                border: isSelected ? "2px solid #96FF43" : "2px solid #444",
                p: 0.5,
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
              {feature.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {feature.description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
