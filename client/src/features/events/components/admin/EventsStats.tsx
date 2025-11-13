import React from "react";
import { Box, Grid } from "@mui/material";
import {
  Event as EventIcon,
  Edit as DraftIcon,
  Computer as OnlineIcon,
  LocationOn as OfflineIcon,
} from "@mui/icons-material";
import StatsCard from "../../../../components/ui/StatsCard";

interface StatsData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor?: string;
  iconColor?: string;
}

export interface EventStats {
  total: number;
  drafts: number;
  online: number;
  offline: number;
}

export interface EventsStatsProps {
  stats: EventStats;
}

const EventsStats: React.FC<EventsStatsProps> = ({ stats }) => {
  const statsData: StatsData[] = [
    {
      title: "Total",
      value: stats.total,
      icon: <EventIcon />,
      backgroundColor: "#bfb5ff",
      iconColor: "black",
    },
    {
      title: "Drafts",
      value: stats.drafts,
      icon: <DraftIcon />,
      backgroundColor: "#F0D7FF",
      iconColor: "black",
    },
    {
      title: "Offline",
      value: stats.offline,
      icon: <OfflineIcon />,
      backgroundColor: "#bfb5ff",
      iconColor: "black",
    },
    {
      title: "Online",
      value: stats.online,
      icon: <OnlineIcon />,
      backgroundColor: "#F0D7FF",
      iconColor: "black",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container>
        {statsData.map((stat, index) => (
          <Grid size={3} key={index}>
            <StatsCard
              textColor={"black"}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              backgroundColor={stat.backgroundColor}
              iconColor={stat.iconColor}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(EventsStats);
