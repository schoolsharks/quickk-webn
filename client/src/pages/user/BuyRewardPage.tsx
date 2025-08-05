import React from 'react'
import BuyReward from '../../features/biding/components/BuyReward'
import { useParams } from 'react-router-dom';
import { useGetLiveRewardQuery } from '../../features/biding/service/bidingApi';
import { Box, Typography } from '@mui/material';
import Loader from '../../components/ui/Loader';

const BuyRewardPage :React.FC = () => {

  const { rewardId } = useParams<{ rewardId: string }>();
  const { data : LiveReward, error, isLoading } = useGetLiveRewardQuery(rewardId as string);
  // Loading state
    if (isLoading ) {
      return (
       <Loader/>
      );
    }
  
    // Error state
    if (error) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default',
          p: 2
        }}>
          <Typography color="error">Failed to load Buy Reward Page.</Typography>
        </Box>
      );
    }
  return (
    <BuyReward reward={LiveReward?.liveReward}/>
  )
}

export default BuyRewardPage;