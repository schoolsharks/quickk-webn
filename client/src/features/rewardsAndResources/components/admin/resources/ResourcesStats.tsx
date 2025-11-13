import React from "react";
import { Box, Grid } from "@mui/material";
import {
  Whatshot as TotalIcon,
  CheckCircle as ActiveIcon,
  EditNote as DraftsIcon,
  Redeem as RedeemIcon,
} from "@mui/icons-material";
import StatsCard from "../../../../../components/ui/StatsCard";

interface StatsData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor?: string;
}

export interface ResourceStats {
  total: number;
  active: number;
  drafts: number;
  totalRedeemed: number;
}

export interface ResourcesStatsProps {
  stats: ResourceStats;
  isLoading?: boolean;
}

const ResourcesStats: React.FC<ResourcesStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  const statsData: StatsData[] = [
    {
      title: "Total",
      value: isLoading ? "..." : stats.total,
      icon: <TotalIcon />,
      backgroundColor: "#bfb5ff",
    },
    {
      title: "Active",
      value: isLoading ? "..." : stats.active,
      icon: <ActiveIcon />,
      backgroundColor: "#F0D7FF",
    },
    {
      title: "Drafts",
      value: isLoading ? "..." : stats.drafts,
      icon: <DraftsIcon />,
      backgroundColor: "#bfb5ff",
    },
    {
      title: "Total Redeemed",
      value: isLoading ? "..." : stats.totalRedeemed,
      icon: <RedeemIcon />,
      backgroundColor: "#F0D7FF",
    },
  ];

  return (
    <Box>
      <Grid container>
        {statsData.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              textColor="#000"
              backgroundColor={stat.backgroundColor}
              iconColor={"#000"}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResourcesStats;
