import React from "react";
import Button from "@mui/material/Button";
import { Box, SxProps, useTheme } from "@mui/material";

interface GreenButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  sx?: SxProps;
  startIcon?: React.ReactNode; // Make it optional and correct type
}

const GreenButton: React.FC<GreenButtonProps> = ({
  onClick,
  disabled = false,
  children,
  fullWidth = false,
  sx = {},
  startIcon, // Destructure startIcon
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {/* Green shadow/background layer */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.palette.primary.light,
          borderRadius: "2px",
          zIndex: 0,
        }}
      />

      {/* Main white button */}
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        fullWidth={fullWidth}
        startIcon={startIcon} // Pass startIcon prop
        sx={{
          position: "relative",
          backgroundColor: "white",
          color: "black",
          border: "1px solid black",
          borderRadius: "2px",
          fontWeight: 600,
          fontSize: "18px",
          transform: "translateX(4px) translateY(-4px)",
          padding: "8px 12px",
          boxShadow: "none",
          zIndex: 1,
          "&:hover": {
            transform: "translateX(2px) translateY(-2px)",
            boxShadow: "none",
          },
          "&:active": {
            transform: "translateX(1px) translateY(-1px)",
          },
          "&:disabled": {
            backgroundColor: "#e5e5e5",
            color: "#9ca3af",
            border: "2px solid #d1d5db",
          },
          ...sx,
        }}
      >
        {children}
      </Button>
    </Box>
  );
};

export default GreenButton;
