import React from "react";
import Slider from "react-slick";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselSlide } from "../../../animation/variants/slideCarousel";
import GlobalButton from "../../../components/ui/button";
import formatEventTime from "../../../utils/formatEventTime";

// API Response types (same as UpcomingEvents)
interface ApiEvent {
  _id: string;
  title: string;
  description: string;
  eventImage: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  virtualMeetingLink?: string;
  ticketInfo: {
    price: number;
    currency: string;
  };
  sponsors: string[];
  highlights: string[];
  interestedCount: number;
  attendedCount: number;
  organizer: string;
}

// Component interfaces
interface Recording {
  id: string;
  topic: string;
  date: string;
  time: string;
  city: string;
  attendees: number;
  thumbnail: string;
  videoUrl?: string;
  fullData: ApiEvent;
}

interface RecordingsProps {
  showScore?: boolean;
  eventsData: any[];
}

const Recordings: React.FC<RecordingsProps> = ({
  showScore = true,
  eventsData,
}) => {
  const theme = useTheme();
  const sliderRef = React.useRef<Slider | null>(null);
  const pastEvents = eventsData || [];

  // Transform API data to component format
  const transformedRecordings = React.useMemo(() => {
    if (!pastEvents || !Array.isArray(pastEvents)) return [];

    return pastEvents.map((apiEvent: ApiEvent) => {
      const startDate = new Date(apiEvent.startDate);

      const transformedRecording: Recording = {
        id: apiEvent._id,
        topic: apiEvent.title,
        date: startDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: formatEventTime(apiEvent.startDate, apiEvent.endDate),
        city: apiEvent.location.split(",").pop()?.trim() || "", // Extract city from full location
        attendees: apiEvent.attendedCount,
        thumbnail: apiEvent.eventImage,
        videoUrl: "#", // As requested, keeping it as # for now
        fullData: apiEvent,
      };

      return transformedRecording;
    });
  }, [pastEvents]);

  const handleWatchClick = (videoUrl?: string) => {
    // Empty click function for now - will handle video playback later
    console.log("Watch clicked for:", videoUrl);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <Box
        display="flex"
        justifyContent="center"
        sx={{ transform: "translateY(15px)" }}
      >
        {dots}
      </Box>
    ),
    customPaging: () => (
      <Box
        sx={{
          width: 9,
          height: 9,
          bgcolor: theme.palette.text.primary,
          borderRadius: "0",
          transition: "all 0.4s",
        }}
      />
    ),
  };

  if (!pastEvents || pastEvents.length === 0) {
    return null;
  }

  if (transformedRecordings.length === 0) {
    return (
      <Box width="100%" mt={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
            Recordings
          </Typography>
          {showScore && (
            <Typography
              variant="h4"
              display="flex"
              alignItems="center"
              sx={{ color: theme.palette.text.primary }}
            >
              10
              <StarsOutlinedIcon sx={{ ml: 0.5, fontSize: "24px" }} />
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            No recordings found
          </Typography>
        </Box>
      </Box>
    );
  }

  const RecordingCard: React.FC<{ recording: Recording }> = ({ recording }) => (
    <Card
      sx={{
        borderRadius: "0px",
        overflow: "hidden",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
        border: `2px solid ${theme.palette.primary.main}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <CardContent
        sx={{
          padding: "16px !important",
          backgroundColor: theme.palette.background.paper,
          flex: "0 0 auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: "20px",
                marginBottom: "8px",
                // textOverflow: "ellipsis",
                // overflow: "hidden",
                // whiteSpace: "nowrap",
                // maxWidth: "180px", // adjust as needed
              }}
            >
              {recording.topic}
            </Typography>

            {/* <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Date & Time
            </Typography> */}

            <Box
              display={"flex"}
              justifyContent="space-between"
              mt={2}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "14px",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {recording.date}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "16px",
                  fontWeight: 600,
                  textAlign: "right",
                }}
              >
                {recording.city}
              </Typography>
            </Box>

            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {recording.attendees > 0
                ? `${recording.attendees} attended`
                : "Event completed"}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={recording.thumbnail}
          alt={recording.topic}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "0% 0%",
            display: "block",
          }}
        />
      </Box>
      {/* Watch Button */}
      <Box sx={{ width: "100%" }}>
        <GlobalButton
          onClick={() => handleWatchClick(recording.videoUrl)}
          fullWidth
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: theme.palette.background.paper,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "18px",
            padding: "12px",
          }}
        >
          Watch
        </GlobalButton>
      </Box>
    </Card>
  );

  return (
    <Box width="100%" mt={2} mb={2}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          Recordings
        </Typography>
        {showScore && (
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            sx={{ color: theme.palette.text.primary }}
          >
            10
            <StarsOutlinedIcon sx={{ ml: 0.5, fontSize: "24px" }} />
          </Typography>
        )}
      </Box>

      {/* Carousel */}
      <Box sx={{ height: "500px" }}>
        <Slider {...settings} ref={sliderRef}>
          {transformedRecordings.map((recording) => (
            <Box key={recording.id} sx={{ height: "100%", px: 1 }}>
              <motion.div
                variants={carouselSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ height: "100%" }}
              >
                <RecordingCard recording={recording} />
              </motion.div>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Recordings;
