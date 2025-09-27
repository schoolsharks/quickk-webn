import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CampaignIcon from "@mui/icons-material/Campaign";
import StatsCard from "../../../../../components/ui/StatsCard";

export interface ReferralStatsData {
  totalReferrals: number;
  signedUp: number;
  converted: number;
  advertised: number;
}

interface ReferralStatsProps {
  stats?: ReferralStatsData;
  isLoading?: boolean;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ stats, isLoading }) => {
  const cards = [
    {
      title: "Total Referrals",
      value: stats?.totalReferrals ?? 0,
      icon: <PeopleIcon />,
      backgroundColor: "#000000",
    },
    {
      title: "Signed Up",
      value: stats?.signedUp ?? 0,
      icon: <HowToRegIcon />,
      backgroundColor: "#404040",
    },
    {
      title: "Converted to Webn",
      value: stats?.converted ?? 0,
      icon: <WorkspacePremiumIcon />,
      backgroundColor: "#000000",
    },
    {
      title: "Advertised",
      value: stats?.advertised ?? 0,
      icon: <CampaignIcon />,
      backgroundColor: "#404040",
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton
                variant="rounded"
                height={120}
                animation="wave"
                sx={{ bgcolor: "#2c2c2c" }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              backgroundColor={card.backgroundColor}
              textColor="white"
              iconColor="white"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReferralStats;
