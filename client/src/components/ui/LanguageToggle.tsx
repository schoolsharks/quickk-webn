import React from "react";
import { Box, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageToggle: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <>
      <Box
        sx={{
          width: 60,
          height: 24,
          bgcolor: active ? "#96FF43" : "#464646",
          display: "flex",
          alignItems: "center",
          p: "2px",
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            bgcolor: active ? "#0E0E0E" : "white",
            ml: active ? 0 : "auto",
            transition: "all 0.3s ease",
          }}
        />
      </Box>
      <Box display="flex" alignItems="center" mt={0.5}>
        <LanguageIcon sx={{ color: "white", fontSize: 14 }} />
        <Typography color="white" fontSize={14}>
          English
        </Typography>
      </Box>
    </>
  );
};

export default LanguageToggle;
