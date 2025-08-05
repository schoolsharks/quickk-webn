import { Box, Button, Typography } from "@mui/material";
import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useNavigate } from "react-router-dom";
import { theme } from "../../theme/theme";

const BottomNavigation: React.FC<{ active?: string }> = ({ active }) => {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/user/impact-dashboard");
  };
  const navigateToRewards = () => {
    navigate("/user/reward");
  };

  return (
    <Box sx={{ display: "flex", borderRadius: 0 }}>
      <Button
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          background:
            active == "home"
              ? theme.palette.primary.main
              : "rgba(37, 37, 37, 1)",

          color: active == "home" ? "black" : "white",
          flex: "1",
          p: "12px 18px",
          borderRadius: "0",
        }}
        onClick={navigateToHome}
      >
        <HomeOutlinedIcon sx={{ fontSize: 35 }} />
        <Typography variant="h5" mt={2}>
          Home
        </Typography>
      </Button>
      <Button
        onClick={navigateToRewards}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          background:
            active == "rewards"
              ? theme.palette.primary.main
              : theme.palette.background.paper,
          color: active == "home" ? "black" : "white",
          flex: "1",
          p: "12px 18px",
          borderRadius: "0",
        }}
      >
        <CardGiftcardIcon sx={{ color: "text.primary", fontSize: 35 }} />
        <Typography variant="h5" color="text.primary" mt={2}>
          Rewards
        </Typography>
      </Button>
    </Box>
  );
};

export default BottomNavigation;
