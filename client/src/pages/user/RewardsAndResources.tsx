import React from "react";
import { Box, Stack } from "@mui/material";
import TopBar from "../../features/rewardsAndResources/components/TopBar";
import StatsCards from "../../features/rewardsAndResources/components/StatsCards";
import AdvertiseBanner from "../../features/rewardsAndResources/components/AdvertiseBanner";

const RewardsAndResources: React.FC = () => {
  return (
    <Stack>
      <TopBar />
      <StatsCards />
      <Box marginTop="40px">
      <AdvertiseBanner />
      </Box>
    </Stack>
  );
};

export default RewardsAndResources;
