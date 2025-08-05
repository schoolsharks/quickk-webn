import React from "react";
import ResultLayout from "../../features/biding/components/ResultLayout";
import { useGetWinnerTicketQuery } from "../../features/biding/service/bidingApi";
import { Box, Typography } from "@mui/material";
import Loader from "../../components/ui/Loader";
import { useParams } from "react-router-dom";

const ResultPage: React.FC = () => {
  const { rewardId } = useParams<{ rewardId: string }>();
  const {
    data: winnerTicket,
    error,
    isLoading,
  } = useGetWinnerTicketQuery({ rewardId });

  if (isLoading) {
    return <Loader />;
  }


  if (!winnerTicket) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Typography color="error">No winner ticket found.</Typography>
      </Box>
    );
  }


  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Typography color="error">Failed to load Result data.</Typography>
      </Box>
    );
  }

  return (
    <ResultLayout
      ticket={{
        tokenNumber: winnerTicket.tokenNumber,
        ticketCode: winnerTicket.ticketCode,
        status: winnerTicket.status,
        price: winnerTicket.price,
        rewardImage: winnerTicket.rewardImage,
        reward: winnerTicket.reward,
      }}
      user={winnerTicket.user}
    />
  );
};

export default ResultPage;
