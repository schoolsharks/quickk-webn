import { Grid } from "@mui/material";
import React from "react";
import DashboardStats from "./DashBoardStats";
import DashboardTables from "./DashBoardTable";
import DashBoardAnalytics from "./DashBoardAnalytics";
// import DailyPulseDC from "./DailyPulseDC";
import ParticipationBoard from "./ParticipationBoard";
// import TotalUserChart from "./TotalUserChart";
import { useGetDashboardStatsQuery } from "../service/adminApi";
import DashboardEvent from "./DashboardEvent";

const DashBoardLayout: React.FC = () => {
  const { data: dashboardStatsData, isLoading: statsLoading } =
    useGetDashboardStatsQuery({});

  return (
    <Grid container p={"24px"} spacing={"12px"}>
      <Grid size={12}>
        <DashboardStats
          totalMembers={dashboardStatsData?.data?.totalMembers || 0}
          totalSignups={dashboardStatsData?.data?.totalSignups || 0}
          upcomingEvents={dashboardStatsData?.data?.upcomingEvents || 0}
          isLoading={statsLoading}
        />
      </Grid>
      <Grid container size={12} spacing={"12px"}>
        <Grid size={7}>
          <DashBoardAnalytics />
        </Grid>
        <Grid size={5}>
          <ParticipationBoard />
        </Grid>
      </Grid>
      <Grid container size={12} spacing={"12px"}>
        <Grid size={7}>
          <DashboardTables />
        </Grid>
        <Grid size={5}>
          <DashboardEvent />
        </Grid>
      </Grid>
      {/* <Grid container size={12} spacing={"12px"}>
        <Grid size={8}>
          <TotalUserChart />
        </Grid>
        <Grid size={4}>
          <DailyPulseDC />
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default DashBoardLayout;
