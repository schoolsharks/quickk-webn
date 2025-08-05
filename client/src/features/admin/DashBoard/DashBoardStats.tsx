import React from "react";
import { Box, Grid } from "@mui/material";
import DashboardStatsCard from "../../../components/ui/DashboardStatsCard";
import DashboardActiveUsersCard from "../../../components/ui/DashboardActiveUsersCard";
import { useNavigate } from "react-router-dom";

interface DashboardStatsData {
  title: string;
  value: string | number;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  valueColor?: string;
  onManageClick?: () => void;
}

const DashboardStats: React.FC = () => {
  const navigate = useNavigate();

  const statsData: DashboardStatsData[] = [
    {
      title: "Total Modules",
      value: "35",
      subtitle: "Manage",
      backgroundColor: "black",
      textColor: "primary.main",
      valueColor: "primary.main",
      onManageClick: () => {
        // Handle manage click - for now just log
        navigate("/admin/learnings/modules");
      },
    },
    {
      title: "Daily Interactions",
      value: "220",
      subtitle: "Manage",
      backgroundColor: "#464646",
      textColor: "primary.main",
      valueColor: "primary.main",
      onManageClick: () => {
        // Handle manage click - for now just log
        navigate("/admin/learnings/dailyInteraction");
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "auto" }}>
      <Grid container spacing={0}>
        {statsData.map((stat, index) => (
          <Grid size={4} key={index}>
            <DashboardStatsCard
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              backgroundColor={stat.backgroundColor}
              textColor={stat.textColor}
              valueColor={stat.valueColor}
              onManageClick={stat.onManageClick}
            />
          </Grid>
        ))}
        <Grid size={4}>
          <DashboardActiveUsersCard
            backgroundColor="black"
            textColor="primary.main"
            valueColor="primary.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;
