import React from "react";
import { Box } from "@mui/material";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  // steps,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: index + 1 <= currentStep ? "primary.main" : "#333",
                color: index + 1 <= currentStep ? "black" : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border:
                  index + 1 === currentStep ? "2px solid primary.main" : "none",
              }}
            >
              {index + 1}
            </Box>
            {index < totalSteps - 1 && (
              <Box
                sx={{
                  width: 60,
                  height: 2,
                  backgroundColor: index + 1 < currentStep ? "primary.main" : "#333",
                  mx: 1,
                }}
              />
            )}
          </Box>
        ))}
      </Box>
      {/* <Typography variant="h5" color="white" textAlign="center" mt={4}>
        Step {currentStep}: {steps[currentStep - 1]}
      </Typography> */}
    </Box>
  );
};

export default StepIndicator;
