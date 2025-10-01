import React from "react";
import { Box, Typography, Stack, Button, useTheme } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import { useNavigate } from "react-router-dom";
import { Leaderboard } from "@mui/icons-material";

const StatusPanel: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const cardData = [
    {
      icon: <CardGiftcardIcon sx={{ fontSize: 24, color: "black" }} />,
      title: "Rewards & Resources",
      value: null,
      bgColor: "#D9D9D9",
      onClick: () => {
        navigate("/user/rewards");
      },
    },
    {
      icon: <Leaderboard sx={{ fontSize: 24, color: "white" }} />,
      title: "Leaderboard",
      value: null,
      bgColor: theme.palette.text.secondary,
      onClick: () => {
        navigate("/user/leaderboard");
      },
    },
    {
      icon: <PeopleOutlineOutlinedIcon sx={{ fontSize: 24, color: "white" }} />,
      title: "Referral",
      value: null,
      bgColor: theme.palette.text.secondary,
      onClick: () => navigate("/user/referral"),
    },
    {
      icon: <PersonOutlineIcon sx={{ fontSize: 24, color: "black" }} />,
      title: "Profile",
      value: null,
      bgColor: "#D9D9D9",
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
            color: idx === 1 || idx === 2 ? "white" : "black",
            // borderRight: idx % 2 === 0 ? "1px solid #252525" : "none",
            // borderBottom: idx < 2 ? "1px solid #252525" : "none",
            "&:hover, &:focus": {
              backgroundColor: item.bgColor,
            },
          }}
        >
          <Box display="flex" gap={1}>
            {item.icon}
            {item.value && <Typography variant="h5">{item.value}</Typography>}
          </Box>
          <Typography variant="h5" mt={"18px"}>
            {item.title}
          </Typography>
        </Button>
      ))}
    </Stack>
  );
};

export default StatusPanel;
