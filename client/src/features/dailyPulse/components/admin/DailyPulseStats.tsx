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
      backgroundColor: "#BFB5FF",
      iconColor: "black",
    },
    {
      title: "Published",
      value: Stats.published,
      icon: <UploadFileIcon />,
      backgroundColor: "#F0D7FF",
      iconColor: "black",
    },
    {
      title: "Drafts",
      value: Stats.drafts,
      icon: <DraftsIcon />,
      backgroundColor: "#BFB5FF",
      iconColor: "black",
    },
    {
      title: "Archived",
      value: Stats.archived,
      icon: <ArchiveIcon />,
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

export default DailyPulseStats;
