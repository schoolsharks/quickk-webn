import { Box, Typography } from "@mui/material";
import React from "react";
import QuickkLogo from "../../assets/images/Quickk-logo.webp";

const Quickk: React.FC = () => {
  return (
    <Box display="flex" alignItems="flex-end" gap={1} flexDirection="column">
      <Typography variant="h6">Powered By</Typography>
      <Box
        component="img"
        src={QuickkLogo}
        alt="Quickk Logo"
        sx={{ height: 32 }}
      />
    </Box>
  );
};

export default Quickk;
