import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Dummy event data - replace with RTK Query later
const dummyEventData = {
  id: "1",
  title: "Pitch & Prosper 2025",
  organizer: "Bv Org.",
  date: "Saturday, 18th October 2025",
  time: "10:00 AM - 6:00 PM",
  location: "WeWork, BKC, Mumbai",
  image: "/src/assets/images/Onboardinghead.png",
  description:
    "A high-energy pitch marathon where early-stage entrepreneurs showcase their startups to a panel of angel investors, venture capitalists, and industry experts. Attendees will witness founders compete in an exciting pitch battle. Founders and attendees will be treated to sessions on crafting an irresistible pitch deck, fundraising strategies, and founder storytelling.",
  sponsors: [
    "IDFC FIRST Bank (Startup Banking Partner)",
    "Amazon (Presenting Partner)",
    "Google for Startups (Tech Partner)",
  ],
  keyHighlights: [
    "Live Pitch Sessions (2 shortlisted startups)",
    "Investor AMA (Ask Me Anything) Panel",
    "Speed Networking with VCs",
    "Best Pitch Award - 5M INR seed grant",
  ],
};

const EventDetails: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleGetTickets = () => {
    navigate(`/user/events/${eventId || "1"}/purchase`);
  };

  const handleBack = () => {
    navigate(-1);
  };

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
          fontWeight={500}
          sx={{
            ml: 2,
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
      <Box sx={{ p: 3 }}>
        {/* Event Title and Organizer */}
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontSize: "25px",
            mb: 0.5,
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
              sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: 16 }}
            />
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              {dummyEventData.date}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, ml: 3 }}
          >
            {dummyEventData.time}
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ mb: 6 }}>
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
              sx={{ color: theme.palette.text.primary, mr: 1, fontSize: 16 }}
            />
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              {dummyEventData.location}
            </Typography>
          </Box>
        </Box>

        {/* About the Event */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              //   fontWeight: 600,
              mb: 0.5,
            }}
          >
            About the event
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            {dummyEventData.description}
          </Typography>
        </Box>

        {/* Sponsors */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              mb: 0.5,
            }}
          >
            Sponsors
          </Typography>
          {dummyEventData.sponsors.map((sponsor, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                mb: 0.5,
                "&::before": {
                  content: '"• "',
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                },
              }}
            >
              {sponsor}
            </Typography>
          ))}
        </Box>

        {/* Key Highlights */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              mb: 0.5,
            }}
          >
            Key Highlights
          </Typography>
          {dummyEventData.keyHighlights.map((highlight, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                mb: 0.5,
                "&::before": {
                  content: '"• "',
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                },
              }}
            >
              {highlight}
            </Typography>
          ))}
        </Box>

        {/* Get Tickets Button */}
        <Button
          onClick={handleGetTickets}
          fullWidth
          sx={{
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.background.paper,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "16px",
            padding: "12px",
            borderRadius: "0px",
          }}
        >
          Get Tickets
        </Button>
      </Box>
    </Box>
  );
};

export default EventDetails;
