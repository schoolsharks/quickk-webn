import React from "react";
import { Box, Grid } from "@mui/material";
import {
  Whatshot as PopularIcon,
  EditNote as DraftsIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StatsCard from "../../../../components/ui/StatsCard";

interface StatsData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor?: string;
  iconColor?: string;
}

export interface Stats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
}

export interface DailyPulseStatsProps {
  Stats: Stats;
}

const DailyPulseStats: React.FC<DailyPulseStatsProps> = ({ Stats }) => {
  const statsData: StatsData[] = [
    {
      title: "Total",
      value: Stats.total,
      icon: <PopularIcon />,
      backgroundColor: "#000000",
      iconColor: "primary.main",
    },
    {
      title: "Published",
      value: Stats.published,
      icon: <UploadFileIcon />,
      backgroundColor: "#474747",
      iconColor: "primary.main",
    },
    {
      title: "Drafts",
      value: Stats.drafts,
      icon: <DraftsIcon />,
      backgroundColor: "#000000",
      iconColor: "primary.main",
    },
    {
      title: "Archived",
      value: Stats.archived,
      icon: <ArchiveIcon />,
      backgroundColor: "#474747",
      iconColor: "primary.main",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container>
        {statsData.map((stat, index) => (
          <Grid size={3} key={index}>
            <StatsCard
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

export default DailyPulseStats;
