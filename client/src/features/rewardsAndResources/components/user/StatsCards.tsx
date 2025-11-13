import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

const StatsCards: React.FC = () => {
  const { totalStars, redeemedStars } = useSelector((state: RootState) => state.user);

  const cards = [
    {
      value: totalStars,
      name: "Total Stars",
      background: "#F0D7FF",
    },
    {
      value: redeemedStars,
      name: "Stars Used",
      background: "#BFB5FF",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {cards.map((card, index) => (
        <Stack
          key={index}
          alignItems={"center"}
          padding="16px"
          bgcolor={card.background}
          flex={1}
          color={"#000"}
        >
          <Typography fontSize={"25px"} fontWeight={"600"} lineHeight={"100%"}>
            {card.value}
          </Typography>
          <Typography fontWeight={"500"}>{card.name}</Typography>
        </Stack>
      ))}
    </Box>
  );
};

export default StatsCards;
