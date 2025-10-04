import React from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  //   Legend,
} from "recharts";
import { useGetEngagementAnalyticsQuery } from "../service/adminApi";

interface EngagementData {
  month: string;
  gowomania: number;
  webn: number;
}

const DashBoardAnalytics: React.FC = () => {
  const theme = useTheme();

  // Fetch real engagement analytics data
  const {
    data: analyticsResponse,
    isLoading,
    error,
  } = useGetEngagementAnalyticsQuery({});

  // Static fallback data in case of error
  const fallbackData: EngagementData[] = [
    { month: "Jan", gowomania: 500, webn: 200 },
    { month: "Feb", gowomania: 250, webn: 180 },
    { month: "Mar", gowomania: 280, webn: 220 },
    { month: "Apr", gowomania: 260, webn: 350 },
    { month: "May", gowomania: 240, webn: 380 },
    { month: "Jun", gowomania: 200, webn: 450 },
    { month: "Jul", gowomania: 180, webn: 400 },
    { month: "Aug", gowomania: 160, webn: 320 },
    { month: "Sep", gowomania: 140, webn: 350 },
    { month: "Oct", gowomania: 120, webn: 280 },
    { month: "Nov", gowomania: 150, webn: 250 },
    { month: "Dec", gowomania: 130, webn: 420 },
  ];

  // Use real data if available, otherwise use fallback
  const engagementData: EngagementData[] =
    analyticsResponse?.data || fallbackData;

  // Calculate dynamic Y-axis scale based on data
  const getOptimalYAxisScale = (data: EngagementData[]) => {
    const allValues = data.flatMap((item) => [item.gowomania, item.webn]);
    const maxValue = Math.max(...allValues);

    if (maxValue === 0) return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] };

    // Add 20% padding to the maximum value
    const paddedMax = Math.ceil(maxValue * 1.2);

    // Create nice round numbers for ticks
    const tickCount = 5;
    const tickInterval = Math.ceil(paddedMax / tickCount);
    const roundedMax = tickInterval * tickCount;

    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      ticks.push(i * tickInterval);
    }

    return { domain: [0, roundedMax], ticks };
  };

  const yAxisConfig = getOptimalYAxisScale(engagementData);

  // Custom legend component
  const CustomLegend = () => (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        justifyContent: "flex-end",
        mb: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 15,
            height: 15,
            backgroundColor: "primary.main",
            borderRadius: 0,
          }}
        />
        <Typography variant="body2" sx={{ color: "black", fontSize: "12px" }}>
          Gowomania
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 15,
            height: 15,
            backgroundColor: "primary.main",
            borderRadius: 0,
          }}
        />
        <Typography variant="body2" sx={{ color: "black", fontSize: "12px" }}>
          Webn
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Paper
      sx={{
        height: "100%",
        p: 3,
        background: "#FFFFFF",
        borderRadius: "0",
        boxShadow: "none",
        color: "black",
        border: `1px solid ${theme.palette.primary.main}`,
        // height: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "black",
                mb: 0.5,
              }}
            >
              Engagement Overview
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              (+5) more in 2025
            </Typography>
          </Box>
          <CustomLegend />
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ height: 350, mt: 2 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
            }}
          >
            <Typography variant="body1" color="error" sx={{ mb: 1 }}>
              Failed to load analytics data
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing fallback data
            </Typography>
          </Box>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={engagementData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              {/* Gradient for gowomania */}
              <linearGradient
                id="gowomaniaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="primary.main" stopOpacity={0.9} />
                <stop offset="30%" stopColor="primary.main" stopOpacity={0.6} />
                <stop offset="70%" stopColor="primary.main" stopOpacity={0.3} />
                <stop offset="100%" stopColor="primary.main" stopOpacity={0.1} />
              </linearGradient>

              {/* Gradient for webn */}
              <linearGradient id="webnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.8}
                />
                <stop
                  offset="50%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.6}
                />
                <stop
                  offset="100%"
                  stopColor={theme.palette.primary.main}
                  stopOpacity={0.4}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="black"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "black",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "black",
                fontSize: 12,
              }}
              domain={yAxisConfig.domain}
              ticks={yAxisConfig.ticks}
            />

            {/* gowomania Area */}
            <Area
              type="monotone"
              dataKey="gowomania"
              stackId="1"
              stroke="#4ade80"
              strokeWidth={2}
              fill="url(#gowomaniaGradient)"
              fillOpacity={1}
              isAnimationActive={false}
            />

            {/* webn Area */}
            <Area
              type="monotone"
              dataKey="webn"
              stackId="1"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              fill="url(#webnGradient)"
              fillOpacity={1}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default DashBoardAnalytics;
