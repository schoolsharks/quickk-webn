import React from "react";
import { Box, Grid } from "@mui/material";
import { Whatshot as PopularIcon } from "@mui/icons-material";
import StatsCard from "../../../components/ui/StatsCard";
import { List } from "lucide-react";
import UploadFileIcon from "@mui/icons-material/UploadFile";

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
  Listed: number;
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
      backgroundColor: "#BFB5FF",
      iconColor: "black",
    },
    {
      title: webnClubMember ? "Moved from Gowomania" : "Moved to Webn",
      value: Stats.moved,
      icon: <UploadFileIcon />,
      backgroundColor: "#F0D7FF",
      iconColor: "black",
    },
    {
      title: "Active",
      value: Stats.Active,
      icon: (
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: "black",
            margin: "0 auto",
          }}
        />
      ),
      backgroundColor: "#BFB5FF",
      iconColor: "black",
    },
    {
      title: "Listed",
      value: Stats.Listed,
      icon: <List />,
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

export default MemberStats;
