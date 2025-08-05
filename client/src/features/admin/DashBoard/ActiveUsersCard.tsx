import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useGetActiveUsersStatsQuery } from "../service/adminApi";

interface ActiveUsersCardProps {
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
}

type TimePeriod = "today" | "last15Days" | "last30Days" | "last90Days";

const ActiveUsersCard: React.FC<ActiveUsersCardProps> = ({
  backgroundColor = "rgba(37, 37, 37, 1)",
  textColor = "text.primary",
  iconColor = "primary.main",
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("today");

  const { data, isLoading, error } = useGetActiveUsersStatsQuery({});

  const periodLabels: Record<TimePeriod, string> = {
    today: "Today",
    last15Days: "15 Days",
    last30Days: "30 Days",
    last90Days: "90 Days",
  };

  const getCurrentValue = (): number => {
    if (!data) return 0;
    return data[selectedPeriod] || 0;
  };

  const getSubtitle = (): string => {
    const period = periodLabels[selectedPeriod];
    return `Active in ${period.toLowerCase()}`;
  };

  const handlePeriodChange = (event: any) => {
    setSelectedPeriod(event.target.value as TimePeriod);
  };

  if (error) {
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
        <CardContent sx={{ padding: 2 }}>
          <Alert
            severity="error"
            sx={{ backgroundColor: "transparent", color: textColor }}
          >
            Error loading active users data
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
        {/* Header with title, dropdown and icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              //   gap: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: textColor,
              }}
            >
              Active Users
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              sx={{
                color: textColor,
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "& .MuiSelect-icon": {
                  color: textColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: iconColor,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: backgroundColor,
                    color: textColor,
                    "& .MuiMenuItem-root": {
                      color: textColor,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="last15Days">15 Days</MenuItem>
              <MenuItem value="last30Days">30 Days</MenuItem>
              <MenuItem value="last90Days">90 Days</MenuItem>
            </Select>
          </FormControl>
          {/* <Box
            sx={{
              color: iconColor,
              display: "flex",
              alignItems: "flex-end",
              "& svg": {
                fontSize: "24px",
              },
            }}
          >
            <UsersIcon />
          </Box> */}
        </Box>

        {/* Value */}
        <Box sx={{ display: "flex", alignItems: "center", minHeight: "32px" }}>
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: iconColor }} />
          ) : (
            <Typography
              variant="h5"
              sx={{
                color: iconColor,
                fontSize: "24px",
              }}
            >
              {getCurrentValue().toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            textDecoration: "underline",
            color: textColor,
          }}
        >
          {getSubtitle()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ActiveUsersCard;
