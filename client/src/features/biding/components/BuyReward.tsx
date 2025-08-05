import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../theme/theme";
import greenTicket from "../assets/ticketGreen.png";
import { useBuyTicketMutation } from "../service/bidingApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

interface LiveReward {
  _id: string;
  startTime: Date;
  endTime: Date;
  price: number;
  status: string;
  name: string;
  description?: string;
  image?: string;
  participantCount: number;
}

interface BuyRewardProps {
  reward: LiveReward;
}

const BuyReward: React.FC<BuyRewardProps> = ({ reward }) => {
  const [buyTicket, { isLoading }] = useBuyTicketMutation();
  const navigate = useNavigate();
  const handleBack = () => navigate("/user/reward");
  const [ticketCount, setTicketCount] = useState(0);
  const { totalStars, redeemedStars } = useSelector(
    (state: RootState) => state.user
  );
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    setTicketCount(ticketCount + 1);
  };

  const subtract = () => {
    if (ticketCount > 0) setTicketCount(ticketCount - 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePurchase = () => {
    // Reset error state
    setError(null);

    const payload = {
      rewardId: reward._id,
      quantity: ticketCount,
    };

    buyTicket(payload)
      .unwrap()
      .then((response) => {
        console.log("Ticket purchased successfully:", response);
        // After successful purchase, navigate to the ticket confirmation page
        navigate("/user/ticket-confirmation");
      })
      .catch((error) => {
        console.error("Error purchasing ticket:", error);
        setError("Failed to purchase ticket. Please try again.");
      });
  };

  // Close the error snackbar
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Box sx={{ color: "white", p: "50px 0px 32px 0px" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <IconButton onClick={handleBack} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Box display={"flex"} alignItems="center" gap={1}>
            <Typography variant="h1" fontSize={"25px"}>
              Live Rewards
            </Typography>
            <IconButton sx={{ color: "white" }}>
              <InfoOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container mt={4}>
        <Grid
          size={6}
          sx={{
            bgcolor: theme.palette.background.paper,
            textAlign: "center",
            py: 2,
          }}
        >
          <Typography variant="h1" fontSize={"25px"}>
            {totalStars || 0}
          </Typography>
          <Typography fontWeight={500} fontSize={"16px"}>
            Total Stars
          </Typography>
        </Grid>
        <Grid size={6} sx={{ bgcolor: "#1A1A1A", textAlign: "center", py: 2 }}>
          <Typography variant="h1" fontSize={"25px"}>
            {redeemedStars || 0}
          </Typography>
          <Typography fontWeight={500} fontSize={"16px"}>
            Stars Placed
          </Typography>
        </Grid>
      </Grid>

      {/* Participants */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          textAlign: "center",
          py: 1,
          fontWeight: 600,
          fontSize: "18px",
          color: "black",
        }}
      >
        {reward.participantCount} Participants
      </Box>

      {/* Reward Card */}
      <Box sx={{ px: "20px", pt: "24px" }}>
        <Box sx={{ position: "relative" }}>
          <Box
            component="img"
            src={reward.image}
            alt={reward.name}
            sx={{ width: "100%", height: "100%", objectFit: "fill" }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "-24px",
              right: "42px",
              color: "black",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {reward.status}
          </Box>
          <Box sx={{ position: "absolute", top: "-16px", right: "50px" }}>
            <Box
              component="img"
              src={greenTicket}
              alt="Ticket Badge"
              sx={{
                transform: "rotate(90deg)",
                width: "35px",
                objectFit: "contain",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: 600,
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              Ticket {reward.price}
              <StarsOutlinedIcon sx={{ fontSize: "14px", ml: 0.5 }} />
            </Box>
          </Box>
        </Box>

        {/* Reward Info */}
        <Box mt={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4">{reward.name}</Typography>
            <Box textAlign="right">
              <Typography variant="caption" color={theme.palette.primary.main}>
                Result Announcement
              </Typography>
              <Typography variant="h4" color={theme.palette.primary.main}>
                {new Date(reward.endTime).toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h3" fontSize={"12px"} mt={2}>
            {reward.description}
          </Typography>
        </Box>

        {/* Quantity Selector */}
        <Box mt={4} display="flex" flexDirection={"column"} gap={0}>
          <Typography variant="h6">No of tickets</Typography>
          <Box display="flex" alignItems="center" mt={"12px"}>
            <IconButton
              onClick={subtract}
              sx={{
                color: "black",
                bgcolor: `${theme.palette.primary.main}`,
                borderRadius: "0",
                "&:hover": {
                  bgcolor: `${theme.palette.primary.main}`,
                },
                "&:focus": {
                  bgcolor: `${theme.palette.primary.main}`,
                },
                "&:active": {
                  bgcolor: `${theme.palette.primary.main}`,
                },
              }}
            >
              <RemoveIcon />
            </IconButton>
            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                px: "26px",
                py: "10px",
                fontWeight: 600,
              }}
            >
              {ticketCount}
            </Box>

            <IconButton
              onClick={add}
              sx={{
                color: "black",
                bgcolor: `${theme.palette.primary.main}`,
                borderRadius: "0",
                "&:hover": {
                  bgcolor: `${theme.palette.primary.main}`,
                },
                "&:focus": {
                  bgcolor: `${theme.palette.primary.main}`,
                },
                "&:active": {
                  bgcolor: `${theme.palette.primary.main}`,
                },
              }}
            >
              <AddIcon />
            </IconButton>

            <Box
              sx={{
                bgcolor: theme.palette.background.paper,
                px: "26px",
                flex: "1",
                py: "10px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {ticketCount * reward.price}
              <StarsOutlinedIcon sx={{ fontSize: "16px" }} />
            </Box>
          </Box>
        </Box>

        {/* Buy Ticket Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "black",
            fontWeight: 600,
            mt: "28px",
            py: 1.5,
            borderRadius: "0",
            fontSize: "20px",
            cursor: "pointer",
            textTransform: "none",
            "&:hover, &:focus": {
              backgroundColor: theme.palette.primary.main,
            },
            "&.Mui-disabled": {
              color: "black",
              opacity: 1,
              backgroundColor: theme.palette.primary.main,
            },
          }}
          disabled={
            isLoading ||
            ticketCount === 0 ||
            totalStars < ticketCount * reward.price
          }
          onClick={handlePurchase}
        >
          {isLoading ? "Processing..." : "Buy Ticket"}
        </Button>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BuyReward;
