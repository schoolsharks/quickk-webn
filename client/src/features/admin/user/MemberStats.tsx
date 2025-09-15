import React from "react";
import { Box, Grid } from "@mui/material";
import {
  Whatshot as PopularIcon,
  EditNote as DraftsIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StatsCard from "../../../components/ui/StatsCard";

interface StatsData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor?: string;
  iconColor?: string;
}

export interface Stats {
  total: number;
  moved: number;
  Active: number;
  NotActive: number;
}

export interface MemberStatsProps {
  Stats: Stats;
  webnClubMember?: boolean;
}

const MemberStats: React.FC<MemberStatsProps> = ({ Stats, webnClubMember }) => {
  const statsData: StatsData[] = [
    {
      title: "Total",
      value: Stats.total,
      icon: <PopularIcon />,
      backgroundColor: "#000000",
      iconColor: "white",
    },
    {
      title: webnClubMember ? "Moved from Gowomania" : "Moved to Webn",
      value: Stats.moved,
      icon: <UploadFileIcon />,
      backgroundColor: "#CD7BFF4D",
      iconColor: "black",
    },
    {
      title: "Active",
      value: Stats.Active,
      icon: <DraftsIcon />,
      backgroundColor: "#000000",
      iconColor: "white",
    },
    {
      title: "Not Active",
      value: Stats.NotActive,
      icon: <ArchiveIcon />,
      backgroundColor: "#CD7BFF4D",
      iconColor: "black",
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container>
        {statsData.map((stat, index) => (
          <Grid size={3} key={index}>
            <StatsCard
              textColor={index % 2 == 0 ? "white" : "black"}
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

export default MemberStats;
