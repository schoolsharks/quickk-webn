import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";

const StatusPanel: React.FC = () => {
  const navigate = useNavigate();
  const {totalStars,rank} = useSelector((state: RootState) => state.user);

  // Helper function to get ordinal suffix
  const getOrdinal = (n: number | null | undefined) => {
    if (typeof n !== "number" || isNaN(n)) return "";
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const cardData = [
    {
      icon: <StarsOutlinedIcon sx={{ fontSize: 24, color: "white" }} />,
      title: "Stars Earned",
      value: totalStars,
      bgColor: "#252525",
    },
    {
      icon: <LeaderboardIcon sx={{ fontSize: 24, color: "white" }} />,
      title: "Leaderboard",
      value: getOrdinal(rank),
      bgColor: "#464646",
      onClick: () => navigate("/user/leaderboard"),
    },
    {
      icon: <CardGiftcardIcon sx={{ fontSize: 24, color: "white" }} />,
      title: "Rewards",
      value: null,
      bgColor: "#464646",
      onClick: () => navigate("/user/reward"),
    },
    {
      icon: <PersonOutlineIcon sx={{ fontSize: 24, color: "white" }} />,
      title: "Profile",
      value: null,
      bgColor: "#252525",
      onClick: () => navigate("/user/profile"),
    },
  ];

  return (
    <Stack direction="row" flexWrap="wrap" width="100%">
      {cardData.map((item, idx) => (
        <Button
          key={item.title}
          onClick={item.onClick || (() => {})}
          sx={{
            width: "50%",
            backgroundColor: item.bgColor,
            borderRadius: 0,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            borderRight: idx % 2 === 0 ? "1px solid #252525" : "none",
            borderBottom: idx < 2 ? "1px solid #252525" : "none",
            "&:hover, &:focus": {
              backgroundColor: item.bgColor,
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {item.icon}
            {item.value && (
              <Typography color="white" variant="h5">
                {item.value}
              </Typography>
            )}
          </Box>
          <Typography color="white" variant="h5" mt={"18px"}>
            {item.title}
          </Typography>
        </Button>
      ))}
    </Stack>
  );
};

export default StatusPanel;
