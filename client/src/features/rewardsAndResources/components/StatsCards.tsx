import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const StatsCards: React.FC = () => {
  const cards = [
    {
      value: 160,
      name: "Total Stars",
      background: "#464646",
    },
    {
      value: 60,
      name: "Stars Used",
      background: "#252525",
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
          color={"#fff"}
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
