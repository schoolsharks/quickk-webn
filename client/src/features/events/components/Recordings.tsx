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
import thumbnail from "../../../assets/images/Events/Recording.webp";

// Dummy data - replace with RTK Query later
interface Recording {
  id: string;
  topic: string;
  date: string;
  time: string;
  city: string;
  attendees: number;
  thumbnail: string;
  videoUrl?: string;
}

const dummyRecordings: Recording[] = [
  {
    id: "1",
    topic: "Digital Marketing Strategies",
    date: "August 20, 2025",
    time: "6:00pm - 8:00pm",
    city: "Mumbai",
    attendees: 250,
    thumbnail: thumbnail,
    videoUrl: "#",
  },
  {
    id: "2",
    topic: "AI and Machine Learning",
    date: "August 15, 2025",
    time: "2:00pm - 5:00pm",
    city: "Bangalore",
    attendees: 320,
    thumbnail: thumbnail,
    videoUrl: "#",
  },
  {
    id: "3",
    topic: "Startup Funding Workshop",
    date: "August 10, 2025",
    time: "10:00am - 1:00pm",
    city: "Delhi",
    attendees: 180,
    thumbnail: thumbnail,
    videoUrl: "#",
  },
];

interface RecordingsProps {
  showScore?: boolean;
}

const Recordings: React.FC<RecordingsProps> = ({ showScore = true }) => {
  const theme = useTheme();
  const sliderRef = React.useRef<Slider | null>(null);

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
          width: 10,
          height: 10,
          bgcolor: theme.palette.text.primary,
          borderRadius: "0",
          transition: "all 0.4s",
        }}
      />
    ),
  };

  const RecordingCard: React.FC<{ recording: Recording }> = ({ recording }) => (
    <Card
      sx={{
        borderRadius: "0px",
        overflow: "hidden",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
        border: `2px solid ${theme.palette.primary.main}`,
        height: "300px",
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

            <Box display={"flex"} justifyContent="space-between">
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
              {recording.attendees} attended
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          height: "180px",
          backgroundColor: theme.palette.background.default,
          backgroundImage: `url(${recording.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          //   flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
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
    <Box width="100%">
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
      <Box sx={{ height: "400px" }}>
        <Slider {...settings} ref={sliderRef}>
          {dummyRecordings.map((recording) => (
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
