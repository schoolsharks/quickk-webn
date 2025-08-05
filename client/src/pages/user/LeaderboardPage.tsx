import React from 'react'
import LeaderboardLayout from '../../features/user/components/LeaderboardLayout'
import { useGetLeaderboardQuery } from '../../features/user/userApi'
import { Box, CircularProgress, Typography } from '@mui/material';


const LeaderboardPage : React.FC = () => {
const { data: leaderboardData, isLoading, error } = useGetLeaderboardQuery({});

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: window.innerHeight,
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
          LeaderBoard Not Available.
        </Typography>
        <Typography variant="body1">
          We are currently unable to retrieve the leaderboard data. Please try again later.
        </Typography>
      </Box>
    );
  }
  return (
    <LeaderboardLayout leaderboardData={leaderboardData}/>
  )
}

export default LeaderboardPage