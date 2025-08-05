import React, { useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Types
interface ChartData {
  month: string;
  groupA: number;
  groupB: number;
  total: number;
}

interface TotalUserChartProps {
  data?: ChartData[];
  onFilterChange?: (userType: string, timeRange: string) => void;
}

// Dummy data that matches the image
const dummyData: ChartData[] = [
  { month: "April", groupA: 6000, groupB: 16000, total: 22000 },
  { month: "May", groupA: 5000, groupB: 2000, total: 7000 },
  { month: "June", groupA: 4000, groupB: 12000, total: 16000 },
  { month: "July", groupA: 6000, groupB: 14000, total: 20000 },
  { month: "August", groupA: 8000, groupB: 17000, total: 25000 },
  { month: "September", groupA: 3000, groupB: 7000, total: 10000 },
];

const TotalUserChart: React.FC<TotalUserChartProps> = ({
  data = dummyData,
  onFilterChange,
}) => {
  const theme = useTheme();
  const [userType, setUserType] = useState("Total Users");
  const [timeRange, setTimeRange] = useState("6 months");
  const [openDropdown, setOpenDropdown] = useState<
    "userType" | "timeRange" | null
  >(null);

  const userTypeOptions = [
    "Inactive Users",
    "Below 80%",
    "Reattempted",
    "Total Users",
  ];

  const timeRangeOptions = ["3 months", "6 months", "1 year"];

  const handleUserTypeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setUserType(value);
    setOpenDropdown(null);
    onFilterChange?.(value, timeRange);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setTimeRange(value);
    setOpenDropdown(null);
    onFilterChange?.(userType, value);
  };

  const handleDropdownOpen = (dropdown: "userType" | "timeRange") => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: theme.palette.background.default,
        borderRadius: 0,
        height: "100%",
      }}
    >
      {/* Header with Title and Legend */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {/* Dropdowns */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0, mb: 1 }}>
          {/* User Type Dropdown */}
          <Box>
            <FormControl sx={{ gap: 0, p: "0px" }}>
              <Select
                value={userType}
                onChange={handleUserTypeChange}
                open={openDropdown === "userType"}
                onOpen={() => handleDropdownOpen("userType")}
                onClose={() => setOpenDropdown(null)}
                IconComponent={KeyboardArrowDown}
                sx={{
                  p: "0",
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.background.default,
                  fontWeight: 700,
                  fontSize: "20px",
                  "& .MuiSelect-select": {
                    padding: "4px 12px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: theme.palette.text.primary,
                  },
                }}
              >
                {userTypeOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      fontSize: "20px",
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Time Range Dropdown */}
          <Box>
            <FormControl size="small">
              <Select
                value={timeRange}
                onChange={handleTimeRangeChange}
                open={openDropdown === "timeRange"}
                onOpen={() => handleDropdownOpen("timeRange")}
                onClose={() => setOpenDropdown(null)}
                IconComponent={KeyboardArrowDown}
                sx={{
                  p: "0",
                  display: "flex",
                  justifyContent: "flex-start",
                  fontSize: "14px",
                  color: theme.palette.primary.main,
                  backgroundColor: theme.palette.background.default,

                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiSelect-select": {
                    py: "0",
                  },
                }}
              >
                {timeRangeOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{
                      color: theme.palette.text.primary,
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Static Legend */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box display={"flex"} alignItems="center" gap={1}>
            <Chip
              label=""
              sx={{
                borderRadius: 0,
                width: "15px",
                height: "15px",
                backgroundColor: theme.palette.primary.main,
                cursor: "default",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            />
            <Typography variant="h6" color="white">
              Group A
            </Typography>
          </Box>

          <Box display={"flex"} alignItems="center" gap={1}>
            <Chip
              label=""
              sx={{
                borderRadius: 0,
                width: "15px",
                height: "15px",
                backgroundColor: "#FFFFFF",
                cursor: "default",
                "&:hover": {
                  backgroundColor: "#FFFFFF",
                },
              }}
            />
            <Typography variant="h6" color="white">
              Group B
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Chart */}
      <Box sx={{ height: "350px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 0"
              stroke={theme.palette.text.secondary}
              opacity={0.3}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.palette.text.primary,
                fontSize: 13,
                fontFamily: theme.typography.fontFamily,
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: theme.palette.text.primary,
                fontSize: 13,
                fontFamily: theme.typography.fontFamily,
              }}
            />
            {/* Group A Bar */}
            <Bar
              dataKey="groupA"
              stackId="stack"
              fill={theme.palette.primary.main}
              radius={[0, 0, 0, 0]}
              barSize={35}
            />
            {/* Group B Bar */}
            <Bar
              dataKey="groupB"
              stackId="stack"
              fill="#FFFFFF"
              radius={[4, 4, 0, 0]}
              barSize={35}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default TotalUserChart;
