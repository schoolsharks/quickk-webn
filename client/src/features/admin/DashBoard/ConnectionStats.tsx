import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
  Skeleton,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import {
  useGetConnectionStatsQuery,
  useLazyExportConnectionsQuery,
} from "../service/adminApi";

interface ConnectionStat {
  platform: string;
  count: number;
}

interface ConnectionStatsData {
  totalConnections: number;
  platformStats: ConnectionStat[];
}

interface AdminConnectionStatsProps {
  className?: string;
}

const AdminConnectionStats: React.FC<AdminConnectionStatsProps> = ({
  className,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current");

  const { data: connectionStats, isLoading } = useGetConnectionStatsQuery({
    period: selectedPeriod,
  });
  const [exportConnections, { isLoading: isExporting }] =
    useLazyExportConnectionsQuery();

  const theme = useTheme();

  // Time period options
  const periodOptions = [
    { value: "current", label: getCurrentMonthLabel() },
    { value: "3months", label: getLast3MonthsLabel() },
    { value: "6months", label: getLast6MonthsLabel() },
  ];

  // Helper functions for labels
  function getCurrentMonthLabel() {
    const now = new Date();
    return now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function getLast3MonthsLabel() {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const startMonth = threeMonthsAgo.toLocaleDateString("en-US", {
      month: "short",
    });
    const endMonth = now.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return `${startMonth}-${endMonth}`;
  }

  function getLast6MonthsLabel() {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startMonth = sixMonthsAgo.toLocaleDateString("en-US", {
      month: "short",
    });
    const endMonth = now.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return `${startMonth}-${endMonth}`;
  }

  // Platform colors mapping
  const platformColors = {
    mail: "#56577A",
    whatsapp: `${theme.palette.primary.main}`,
    facebook: "#000000",
    instagram: "#FFFFFF",
  };

  const handleExport = async () => {
    try {
      const result = await exportConnections({
        limit: 1000, // Export last 1000 connections
        period: selectedPeriod,
      }).unwrap();

      // Create blob and download
      const blob = new Blob([result], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `connections-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (isLoading) {
    return (
      <Card
        className={className}
        sx={{
          background: "linear-gradient(135deg, #E5B4F3 0%, #DDD6FE 100%)",
          borderRadius: 0,
          border: "none",
          height: "200px",
        }}
      >
        <CardContent sx={{ p: 3, height: "100%" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Box>
              <Skeleton width={180} height={28} />
              <Skeleton width={60} height={20} sx={{ mt: 1 }} />
            </Box>
            <Skeleton width={40} height={40} variant="circular" />
          </Box>

          <Box mb={2}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} mb={1}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Skeleton width={80} height={16} />
                  <Skeleton width={20} height={16} />
                </Box>
                <Skeleton width="100%" height={8} variant="rectangular" />
              </Box>
            ))}
          </Box>

          <Box textAlign="right">
            <Skeleton width={80} height={40} sx={{ ml: "auto" }} />
            <Skeleton width={120} height={16} sx={{ ml: "auto", mt: 0.5 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const stats = connectionStats as ConnectionStatsData;
  const totalCount =
    stats?.platformStats?.reduce((sum, stat) => sum + stat.count, 0) || 1;

  return (
    <Card
      className={className}
      sx={{
        background: "#CD7BFF4D",
        borderRadius: 0,
        width: " 100%",
        border: `1px solid ${theme.palette.primary.main}`,
      }}
    >
      <CardContent
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={4}
        >
          <Box display={"flex"} flexDirection="row" gap={2}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#000000",
              }}
            >
              Network & Connections
            </Typography>
            <FormControl size="small">
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                sx={{
                  backgroundColor: "#ffffff",
                  minWidth: 120,
                  borderRadius: 0,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-select": {
                    fontSize: "12px",
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    py: 1,
                    px: 2,
                  },
                  "& .MuiInputBase-root":{
                    borderRadius:"0"
                  }
                }}
              >
                {periodOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: theme.palette.primary.main,
                      }}
                    >
                      {option.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <IconButton
            onClick={handleExport}
            disabled={isExporting}
            sx={{
              backgroundColor: "transparent",
              color: "#000000",
            }}
          >
            <Download fontSize="medium" />
          </IconButton>
        </Box>
        <Box display={"flex"} flex={1} gap={4}>
          {/* Platform Statistics */}
          <Box flex={1} mb={2}>
            {stats?.platformStats?.map((stat) => {
              const percentage =
                totalCount > 0 ? (stat.count / totalCount) * 100 : 0;
              const platformName =
                stat.platform.charAt(0).toUpperCase() + stat.platform.slice(1);

              return (
                <Box key={stat.platform} mb={1}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={0.5}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 500,
                        color: "#000000",
                      }}
                    >
                      {platformName} - {stat.count.toString().padStart(2, "0")}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 0,
                      backgroundColor: "transparent",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          platformColors[
                            stat.platform as keyof typeof platformColors
                          ] || "#6B7280",
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Total Connections */}
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Box textAlign="right">
              <Typography
                sx={{
                  fontSize: "80px",
                  fontWeight: 700,
                  color: "#000000",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                }}
              >
                {(stats?.totalConnections ?? 0).toString().padStart(2, "0")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#000000",
                }}
              >
                Connections
              </Typography>
              <Typography
                sx={{
                  fontSize: "30px",
                  fontWeight: 600,
                  color: "#000000",
                }}
              >
                Made
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminConnectionStats;
