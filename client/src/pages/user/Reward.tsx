import React from "react";
import RewardsLayout from "../../features/biding/components/RewardsLayout";
import { useGetAllRewardsQuery } from "../../features/biding/service/bidingApi";
import { Box, CircularProgress, Typography } from "@mui/material";

const Reward: React.FC = () => {
  const { data: RewardData, isLoading, error } = useGetAllRewardsQuery({});

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          bgcolor: "#1e1e1e",
          p: 3,
          borderRadius: 2,
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Rewards Not Available
        </Typography>
        <Typography variant="body1">
          Oops! We couldn't fetch the rewards at the moment. Please try again
          later.
        </Typography>
      </Box>
    );
  }
  return (
    <RewardsLayout
      liveReward={RewardData.liveRewards}
      upcomingRewards={RewardData.upcomingRewards}
    />
  );
};

export default Reward;
