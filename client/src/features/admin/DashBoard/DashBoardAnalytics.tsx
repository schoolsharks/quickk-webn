import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  //   Legend,
} from "recharts";

interface EngagementData {
  month: string;
  learnings: number;
  challenges: number;
}

const DashBoardAnalytics: React.FC = () => {
  // Static data matching the chart pattern from the image
  const engagementData: EngagementData[] = [
    { month: "Jan", learnings: 500, challenges: 200 },
    { month: "Feb", learnings: 250, challenges: 180 },
    { month: "Mar", learnings: 280, challenges: 220 },
    { month: "Apr", learnings: 260, challenges: 350 },
    { month: "May", learnings: 240, challenges: 380 },
    { month: "Jun", learnings: 200, challenges: 450 },
    { month: "Jul", learnings: 180, challenges: 400 },
    { month: "Aug", learnings: 160, challenges: 320 },
    { month: "Sep", learnings: 140, challenges: 350 },
    { month: "Oct", learnings: 120, challenges: 280 },
    { month: "Nov", learnings: 150, challenges: 250 },
    { month: "Dec", learnings: 130, challenges: 420 },
  ];

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
            backgroundColor: "#96FF43",
            borderRadius: 0,
          }}
        />
        <Typography variant="body2" sx={{ color: "white", fontSize: "12px" }}>
          Modules
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 15,
            height: 15,
            backgroundColor: "#3b82f6",
            borderRadius: 0,
          }}
        />
        <Typography variant="body2" sx={{ color: "white", fontSize: "12px" }}>
          Challenges
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Paper
      sx={{
        height:"100%",
        p: 3,
        background: "#0D0D0D",
        borderRadius: "0",
        color: "white",
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
                color: "white",
                mb: 0.5,
              }}
            >
              Engagement Overview
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                fontSize: "12px",
                fontWeight: 500,
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
              {/* Gradient for Learnings */}
              <linearGradient
                id="learningsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#96FF43" stopOpacity={0.9} />
                <stop offset="30%" stopColor="#96FF43" stopOpacity={0.6} />
                <stop offset="70%" stopColor="#96FF43" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#96FF43" stopOpacity={0.1} />
              </linearGradient>

              {/* Gradient for Challenges */}
              <linearGradient
                id="challengesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#2563eb" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255, 255, 255, 0.7)",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "rgba(255, 255, 255, 0.7)",
                fontSize: 12,
              }}
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
            />

            {/* Learnings Area */}
            <Area
              type="monotone"
              dataKey="learnings"
              stackId="1"
              stroke="#4ade80"
              strokeWidth={2}
              fill="url(#learningsGradient)"
              fillOpacity={1}
            />

            {/* Challenges Area */}
            <Area
              type="monotone"
              dataKey="challenges"
              stackId="1"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#challengesGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default DashBoardAnalytics;
