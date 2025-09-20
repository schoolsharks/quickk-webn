import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  backgroundColor = "rgba(37, 37, 37, 1)",
  textColor = "text.primary",
  iconColor = "primary.main",
}) => {
  return (
    <Card
      sx={{
        backgroundColor: backgroundColor,
        border: "none",
        boxShadow: "none",
        height: "100%",
        minHeight: "100px",
        borderRadius: "0px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          "&:last-child": {
            paddingBottom: 3,
          },
        }}
      >
        {/* Header with title and icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            // mb: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: textColor,
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              color: iconColor,
              display: "flex",
              alignItems: "flex-end",
              "& svg": {
                fontSize: "24px",
              },
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Value */}
        <Typography
          variant="h5"
          sx={{
            color: iconColor,
            fontSize: "24px",
          }}
        >
          {typeof value === "number" && value < 10 ? `0${value}` : value}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            textDecoration: "underline",
            color: textColor,
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
