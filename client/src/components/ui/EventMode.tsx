import React from "react";
import { Box, Typography } from "@mui/material";

const EventModeToggle: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <Box display={"flex"} flexDirection="column" alignItems="center">
      <Box
        sx={{
          width: 60,
          height: 24,
          bgcolor: active ? "#CD7BFF" : "#464646",
          display: "flex",
          alignItems: "center",
          p: "2px",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            width: 18,
            height: 18,
            bgcolor: active ? "#0E0E0E" : "white",
            ml: active ? 0 : "auto",
            transition: "all 0.3s ease",
          }}
        />
      </Box>
      <Box display="flex" alignItems="center" mt={0.5}>
        <Typography color="black" fontSize={12}>
          Event Mode
        </Typography>
      </Box>
    </Box>
  );
};

export default EventModeToggle;
