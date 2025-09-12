import React from "react";
import { Typography, Stack, Button, useTheme } from "@mui/material";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";

const TopStatusPanel: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { totalStars, rank } = useSelector((state: RootState) => state.user);

  // Helper function to get ordinal suffix
  const getOrdinal = (n: number | null | undefined) => {
    if (typeof n !== "number" || isNaN(n)) return "";
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const topCardData = [
    {
      icon: <StarsOutlinedIcon sx={{ fontSize: 34, color: "white" }} />,
      value: totalStars,
      bgColor: theme.palette.text.secondary,
    },
    {
      icon: <LeaderboardIcon sx={{ fontSize: 34, color: "black" }} />,
      value: getOrdinal(rank),
      bgColor: "#D9D9D9",
      onClick: () => navigate("/user/leaderboard"),
    },
  ];

  return (
    <Stack
      direction="row"
      width="100%"
      sx={{
        borderRadius: 0,
        overflow: "hidden",
      }}
    >
      {topCardData.map((item, idx) => (
        <Button
          key={idx}
          onClick={item.onClick || (() => {})}
          sx={{
            flex: 1,
            backgroundColor: item.bgColor,
            borderRadius: 0,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
            color: idx === 1 ? "black" : "white",
            minHeight: 64,
            "&:hover, &:focus": {
              backgroundColor: item.bgColor,
              opacity: 0.9,
            },
          }}
        >
          {item.icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            {item.value}
          </Typography>
        </Button>
      ))}
    </Stack>
  );
};

export default TopStatusPanel;
