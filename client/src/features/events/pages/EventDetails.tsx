import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import event from "../../../assets/images/Onboardinghead.png";
import { useGetEventByIdQuery } from "../services/eventsApi";
import Loader from "../../../components/ui/Loader";
import ErrorLayout from "../../../components/ui/Error";
import formatEventTime from "../../../utils/formatEventTime";
import { extractFullDateWithDay } from "../../../utils/dateExtract";
import eventFallback from "../../../assets/images/Events/Events_fallback_img.png";

// Dummy event data - replace with RTK Query later
// const EventData = {
//   id: "1",
//   title: "Pitch & Prosper 2025",
//   organizer: "Bv Org.",
//   date: "Saturday, 18th October 2025",
//   time: "10:00 AM - 6:00 PM",
//   location: "WeWork, BKC, Mumbai",
//   image: event,
//   description:
//     "A high-energy pitch marathon where early-stage entrepreneurs showcase their startups to a panel of angel investors, venture capitalists, and industry experts. Attendees will witness founders compete in an exciting pitch battle. Founders and attendees will be treated to sessions on crafting an irresistible pitch deck, fundraising strategies, and founder storytelling.",
//   sponsors: [
//     "IDFC FIRST Bank (Startup Banking Partner)",
//     "Amazon (Presenting Partner)",
//     "Google for Startups (Tech Partner)",
//   ],
//   keyHighlights: [
//     "Live Pitch Sessions (2 shortlisted startups)",
//     "Investor AMA (Ask Me Anything) Panel",
//     "Speed Networking with VCs",
//     "Best Pitch Award - 5M INR seed grant",
//   ],
// };

const EventDetails: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const {
    data: EventData,
    isError,
    isLoading,
  } = useGetEventByIdQuery(eventId, { skip: !eventId });

  const handleGetTickets = () => {
    if (!EventData?.virtualMeetingLink) return;
    window.open(EventData.virtualMeetingLink);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorLayout />;
  }

  const eventTime =
    EventData?.startDate && EventData?.endDate
      ? formatEventTime(EventData.startDate, EventData.endDate)
      : EventData?.time || "";

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
          {EventData?.title}
        </Typography>
      </Box>

      {/* Event Image */}
      <Box
        sx={{
          height: "400px",
          backgroundColor: theme.palette.background.default,
          backgroundImage: `url(${EventData?.eventImage || eventFallback})`,
          backgroundSize: "contain",
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
          {EventData?.title}
        </Typography>
        {EventData.organizer && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            By{" "}
            {typeof EventData?.organizer === "object"
              ? EventData?.organizer?.name
              : EventData?.organizer}
          </Typography>
        )}

        {/* Date and Time */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              mb: 0.5,
              mt: 6,
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
              {(() => {
                const date = extractFullDateWithDay(EventData?.startDate || "");
                return `${date}`;
              })()}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, ml: 3 }}
          >
            {eventTime}
          </Typography>
        </Box>

        {/* Location */}
        {EventData?.location ? (
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
                {EventData?.location}
              </Typography>
            </Box>
          </Box>
        ) : null}

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
              whiteSpace: "pre-line",
            }}
          >
            {EventData?.description}
          </Typography>
        </Box>

        {/* Sponsors */}
        {EventData.sponsors?.length &&
        EventData.sponsors[0].name.trim() !== "" ? (
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
            {EventData.sponsors.map((sponsor: any, index: number) => (
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
                {typeof sponsor === "object" ? sponsor?.name : sponsor}
              </Typography>
            ))}
          </Box>
        ) : null}

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
          {EventData.keyHighlights.map((highlight: any, index: number) => {
            if (highlight !== "")
              return (
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
                  {typeof highlight === "object"
                    ? highlight?.name || highlight?.title
                    : highlight}
                </Typography>
              );
          })}
        </Box>

        {/* Custom Sections */}
        {EventData.customSections?.length > 0 &&
          EventData.customSections.map((section: any, index: number) => (
            <Box key={index} sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  color: theme.palette.primary.main,
                  mb: 0.5,
                }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  whiteSpace: "pre-line",
                }}
              >
                {section.description}
              </Typography>
            </Box>
          ))}

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
          {EventData.virtualMeetingLink ? "Apply Now" : "Coming Soon !"}
        </Button>
      </Box>
    </Box>
  );
};

export default EventDetails;
