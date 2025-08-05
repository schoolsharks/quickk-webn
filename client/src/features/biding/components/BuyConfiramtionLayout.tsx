import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import Confiramtion from "../assets/confirmation.png";
import GlobalButton from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import TicketItem from "../../../components/ui/TicketItem";

interface Ticket {
  tokenNumber: number;
  ticketCode: string;
  status: string;
  rewardImage?: string;
  id?: string;
  reward?: string;
  user?: string;
}

interface BuyConfirmationProps {
  purchasedTickets: Ticket[];
  lastPurchaseSuccess: boolean;
}

const BuyConfiramtionLayout: React.FC<BuyConfirmationProps> = (
  BuyConfirmationProps
) => {
  const navigate = useNavigate();

  const handleBuy = () => {
    navigate(
      `/user/buyReward/${BuyConfirmationProps.purchasedTickets[0].reward}`
    );
  };

  const handleHome = () => {
    navigate("/user/dashboard");
  };

  return (
    <Stack justifyContent="space-between" minHeight="100vh" pt="130px" pb={"50px"} px={"25px"} maxHeight={window.innerHeight} >
      <Box
        component="img"
        src={Confiramtion}
        alt="Confiramtion"
        sx={{
          width: "100%",
          height: "160px",
          objectFit: "contain",
        }}
      />

      <Typography variant="h1" fontSize="40px" textAlign={"center"}>
        Order Placed!
      </Typography>

      <Stack spacing={2}>
        {BuyConfirmationProps.purchasedTickets.map((ticket, index) => (
          <TicketItem key={ticket.id ?? index} ticket={ticket} />
        ))}
      </Stack>

      <Box display="flex" flexDirection="row" gap={0}>
        <GlobalButton
          onClick={handleBuy}
          sx={{ background: "rgba(70, 70, 70, 1)", width: "50%",color:"white" }}
        >
          Buy More
        </GlobalButton>
        <GlobalButton
          onClick={handleHome}
          sx={{ background: "rgba(37, 37, 37, 1)", width: "50%",color:"white" }}
        >
          Home
        </GlobalButton>
      </Box>
    </Stack>
  );
};

export default BuyConfiramtionLayout;
