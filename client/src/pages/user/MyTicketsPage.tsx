import React from 'react'
import MyTicketsLayout from '../../features/biding/components/MyTicketsLayout'
import { useGetUserTicketsQuery } from '../../features/biding/service/bidingApi';
import { Box, CircularProgress, Typography } from '@mui/material';

const MyTicketsPage : React.FC= () => {
   const { data: TicketData, isLoading, error } = useGetUserTicketsQuery({});
  
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
    <MyTicketsLayout currentTickets={TicketData.currentTickets} pastTickets={TicketData.pastTickets}/>
  )
}

export default MyTicketsPage