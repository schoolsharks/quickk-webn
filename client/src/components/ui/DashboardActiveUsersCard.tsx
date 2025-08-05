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
import { KeyboardArrowDown as ArrowDownIcon } from "@mui/icons-material";
import { useGetActiveUsersStatsQuery } from "../../features/admin/service/adminApi";

interface DashboardActiveUsersCardProps {
  backgroundColor?: string;
  textColor?: string;
  valueColor?: string;
}

type TimePeriod = "today" | "last15Days" | "last30Days" | "last90Days";

const DashboardActiveUsersCard: React.FC<DashboardActiveUsersCardProps> = ({
  backgroundColor = "#464646",
  textColor = "text.primary",
  valueColor = "primary.main",
}) => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<TimePeriod>("last90Days");

  // Using dummy data for now - uncomment below when API is ready
  const { data, isLoading, error } = useGetActiveUsersStatsQuery({});
  //   const data = null;
  //   const isLoading = false;
  //   const error = null;

  const getCurrentValue = (): number => {
    if (!data) return 0; // Dummy data as requested
    return data[selectedPeriod] || 0;
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
          height: "80px",
          minHeight: "80px",
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
            Error loading data
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
        height: "80px",
        minHeight: "80px",
        borderRadius: "0px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
          alignItems: "center",
          "&:last-child": {
            paddingBottom: 2,
          },
        }}
      >
        <Box>
          {/* Title */}
          <Typography
            variant="body1"
            sx={{
              color: textColor,
              fontWeight: 600,
              fontSize: "18px",
              mt:1,
            }}
          >
            Total Active Users
          </Typography>

          {/* Dropdown */}
          <Box>
            <FormControl
              size="small"
              sx={{
                padding: "0",
                "& .MuiSelect-select": {
                  px: "0",
                },
              }}
            >
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                IconComponent={ArrowDownIcon}
                sx={{
                  color: textColor,
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "none",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: textColor,
                    fontSize: "18px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: backgroundColor,
                      color: textColor,
                      "& .MuiMenuItem-root": {
                        color: "white",
                        fontSize: "14px",
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
                <MenuItem value="last15Days">Last 15 Days</MenuItem>
                <MenuItem value="last30Days">Last 30 Days</MenuItem>
                <MenuItem value="last90Days">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: "58px",
            mb: 1,
          }}
        >
          {isLoading ? (
            <CircularProgress size={32} sx={{ color: valueColor }} />
          ) : (
            <Typography
              variant="h2"
              sx={{
                color: valueColor,
                fontWeight: 400,
                fontSize: "30px",
                lineHeight: 1,
              }}
            >
              {getCurrentValue().toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardActiveUsersCard;
