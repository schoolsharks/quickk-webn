import React from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../../components/ui/StatsCard";
import { Person } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface DashboardStatsProps {
  totalMembers: number;
  totalSignups: number;
  upcomingEvents: number;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalMembers = 0,
  totalSignups = 0,
  upcomingEvents = 0,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const statsData = [
    {
      title: "Total Members",
      value: isLoading ? "..." : totalMembers,
      backgroundColor: "black",
      icons: <Person />,
      onManageClick: () => {
        navigate("/admin/members/webn");
      },
    },
    {
      title: "Total Signups",
      value: isLoading ? "..." : totalSignups,
      backgroundColor: "#464646",
      icons: <Person />,
      onManageClick: () => {
        navigate("/admin/members/gowomania");
      },
    },
    {
      title: "Upcoming Events",
      value: isLoading ? "..." : upcomingEvents,
      backgroundColor: "Black",
      icons: <CalendarTodayIcon />,
      onManageClick: () => {
        navigate("/admin/events");
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <Grid container spacing={0}>
        {statsData.map((stat, index) => (
          <Grid size={4} key={index}>
            <StatsCard
              icon={stat.icons}
              title={stat.title}
              value={stat.value}
              backgroundColor={stat.backgroundColor}
              textColor="white"
              iconColor="white"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardStats;
