import React, { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import event from "../../../assets/images/Onboardinghead.png";

// Dummy event data - replace with RTK Query later
const dummyEventData = {
  id: "1",
  title: "Pitch & Prosper 2025",
  organizer: "Bv Org.",
  date: "Saturday, 18th October 2025",
  time: "10:00 AM - 6:00 PM",
  location: "WeWork, BKC, Mumbai",
  image: event,
  ticketPrice: 500, // Price per ticket in INR
};

const TicketPurchase: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const handleBack = () => {
    navigate(-1);
  };

  const handleIncreaseQuantity = () => {
    setTicketQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity((prev) => prev - 1);
    }
  };

  const handleBuyTickets = () => {
    // TODO: Integrate Razorpay payment gateway here
    // For now, we'll directly navigate to success page

    // Razorpay integration would go here:
    // const options = {
    //   key: "YOUR_RAZORPAY_KEY",
    //   amount: totalAmount * 100, // Amount in paise
    //   currency: "INR",
    //   name: dummyEventData.title,
    //   description: `${ticketQuantity} ticket(s) for ${dummyEventData.title}`,
    //   handler: function(response) {
    //     // Payment success callback
    //     navigate(`/user/events/${eventId}/success`);
    //   },
    //   prefill: {
    //     name: "User Name",
    //     email: "user@example.com",
    //     contact: "9999999999"
    //   }
    // };
    // const rzp = new window.Razorpay(options);
    // rzp.open();

    // For now, directly navigate to success page
    navigate(
      `/user/events/${
        eventId || "1"
      }/success?quantity=${ticketQuantity}&amount=${totalAmount}`
    );
  };

  const totalAmount = ticketQuantity * dummyEventData.ticketPrice;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Button
          onClick={handleBack}
          sx={{
            minWidth: "auto",
            p: 1,
            color: theme.palette.text.primary,
          }}
        >
          <ArrowBackIcon />
        </Button>
        <Typography
          variant="h4"
          sx={{
            ml: 2,
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          {dummyEventData.title}
        </Typography>
      </Box>

      {/* Event Image */}
      <Box
        sx={{
          height: "200px",
          backgroundColor: theme.palette.background.default,
          backgroundImage: `url(${dummyEventData.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          Event Image
        </Typography> */}
      </Box>

      {/* Content */}
      <Box sx={{ py: 3 }}>
        {/* Event Title and Organizer */}
        <Box px={3}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 1,
            }}
          >
            {dummyEventData.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 6,
            }}
          >
            By {dummyEventData.organizer}
          </Typography>

          {/* Date and Time */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.primary.main,
                mb: 0.5,
              }}
            >
              Date and Time
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarTodayOutlinedIcon
                sx={{ color: theme.palette.text.primary, mr: 1, fontSize: 16 }}
              />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                {dummyEventData.date}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, ml: 3 }}
            >
              {dummyEventData.time}
            </Typography>
          </Box>

          {/* Location */}
          <Box sx={{ mb: 10 }}>
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.primary.main,
                mb: 0.5,
              }}
            >
              Location
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LocationOnOutlinedIcon
                sx={{
                  color: theme.palette.text.secondary,
                  mr: 1,
                  fontSize: 16,
                }}
              />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.primary }}
              >
                {dummyEventData.location}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Ticket Selection */}
        <Box
          sx={{
            backgroundColor: "#CD7BFF6E",
            p: 3,
            mb: 6,
            display: "flex",
            flexDirection: "column",
            alignContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              No of Tickets
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={handleDecreaseQuantity}
                disabled={ticketQuantity <= 1}
                sx={{
                  height: "30px",
                  width: "30px",
                  borderRadius: "0px",
                  backgroundColor: theme.palette.background.paper,
                  "&:disabled": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              >
                <RemoveIcon />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.text.primary,
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                {ticketQuantity.toString().padStart(2, "0")}
              </Typography>
              <IconButton
                onClick={handleIncreaseQuantity}
                sx={{
                  height: "30px",
                  width: "30px",
                  borderRadius: "0px",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            height={"1px"}
            bgcolor={theme.palette.primary.main}
            width={"100%"}
            mx={"auto"}
            mb={2}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              Amount:
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {totalAmount} INR
            </Typography>
          </Box>
        </Box>

        {/* Buy Tickets Button */}
        <Box px={3}>
          <Button
            onClick={handleBuyTickets}
            fullWidth
            sx={{
              backgroundColor: theme.palette.text.secondary,
              color: theme.palette.background.paper,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "16px",
              padding: "12px",
              borderRadius: "0px",
            }}
          >
            Buy Tickets
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketPurchase;
