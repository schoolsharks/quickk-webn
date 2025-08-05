import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  valueColor?: string;
  onManageClick?: () => void;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({
  title,
  value,
  subtitle = "Manage",
  backgroundColor = "#252525",
  textColor = "#96FF43",
  valueColor = "primary.main",
  onManageClick,
}) => {
  return (
    <Card
      sx={{
        backgroundColor: backgroundColor,
        border: "none",
        boxShadow: "none",
        height: "80px",
        minHeight: "80px",
        borderRadius: "0px",
        display: "flex",
        flexDirection: "column",
        cursor: onManageClick ? "pointer" : "default",
      }}
      onClick={onManageClick}
    >
      <CardContent
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          "&:last-child": {
            paddingBottom: 2,
          },
        }}
      >
        <Box>
          {/* Title */}
          <Typography
            sx={{
              color: textColor,
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            {title}
          </Typography>

          {/* Subtitle/Manage link */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "space-between",
              // mt: "auto",
            }}
          >
            <Typography
              sx={{
                color: textColor,
                fontSize: "16px",
                fontWeight: 400,
              }}
            >
              {subtitle}
            </Typography>
            <ArrowIcon
              sx={{
                color: textColor,
                fontSize: "18px",
                transform: "rotate(-45deg)",
                ml: 1,
              }}
            />
          </Box>
        </Box>
        <Box>
          {/* Value */}
          <Typography
            variant="h2"
            sx={{
              color: valueColor,
              fontWeight: 400,
              fontSize: "30px",
              lineHeight: 1,
              mb: 1,
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsCard;
