import { Grid } from "@mui/material";
import React from "react";
import DashboardStats from "./DashBoardStats";
import DashboardTables from "./DashBoardTable";
import DashBoardAnalytics from "./DashBoardAnalytics";
import DailyPulseDC from "./DailyPulseDC";
import ParticipationBoard from "./ParticipationBoard";
import TotalUserChart from "./TotalUserChart";

const DashBoardLayout: React.FC = () => {
  return (
    <Grid container p={"24px"} spacing={"12px"}>
      <Grid size={12}>
        <DashboardStats />
      </Grid>
      <Grid container size={12} spacing={"12px"}>
        <Grid size={8}>
          <DashBoardAnalytics />
        </Grid>
        <Grid size={4}>
          <ParticipationBoard />
        </Grid>
      </Grid>
      <Grid size={12}>
        <DashboardTables />
      </Grid>
      <Grid container size={12} spacing={"12px"}>
        <Grid size={8}>
          <TotalUserChart />
        </Grid>
        <Grid size={4}>
          <DailyPulseDC />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashBoardLayout;
