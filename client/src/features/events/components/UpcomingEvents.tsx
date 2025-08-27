import React, { useState } from "react";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselSlide } from "../../../animation/variants/slideCarousel";

// Dummy data - replace with RTK Query later
interface UpcomingEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  time?: string;
}

interface MonthEvents {
  month: string;
  year: number;
  events: UpcomingEvent[];
}

const dummyUpcomingEvents: MonthEvents[] = [
  {
    month: "September",
    year: 2025,
    events: [
      {
        id: "1",
        date: "18th",
        title: "Delhi Workshop",
        description:
          "A comprehensive workshop covering advanced topics in technology and innovation. This session will include hands-on activities and networking opportunities.",
        location: "Delhi",
        time: "10:00am - 5:00pm",
      },
      {
        id: "2",
        date: "21th",
        title: "Goa Workshop",
        description:
          "Interactive learning session focused on practical applications and real-world scenarios. Perfect for professionals looking to enhance their skills.",
        location: "Goa",
        time: "2:00pm - 6:00pm",
      },
      {
        id: "3",
        date: "31th",
        title: "Mumbai Workshop",
        description:
          "Interactive learning session focused on practical applications and real-world scenarios. Perfect for professionals looking to enhance their skills.",
        location: "Mumbai",
        time: "2:00pm - 6:00pm",
      },
    ],
  },
  {
    month: "October",
    year: 2025,
    events: [
      {
        id: "3",
        date: "5th",
        title: "Bangalore",
        description:
          "Join fellow tech enthusiasts for an evening of knowledge sharing and collaboration. Features keynote speakers and panel discussions.",
        location: "Bangalore",
        time: "6:00pm - 9:00pm",
      },
      {
        id: "4",
        date: "12th",
        title: "Professional",
        description:
          "Understanding career growth essentials and navigating professional challenges. Includes networking session and career guidance.",
        location: "Pune",
        time: "9:00am - 1:00pm",
      },
      {
        id: "5",
        date: "18th",
        title: "Innovation",
        description:
          "Exploring the latest trends in technology and business innovation. Features industry leaders and startup showcases.",
        location: "Hyderabad",
        time: "8:00am - 6:00pm",
      },
    ],
  },
];

interface UpcomingEventsProps {
  showScore?: boolean;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  showScore = true,
}) => {
  const theme = useTheme();
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const sliderRef = React.useRef<Slider | null>(null);

  const toggleEventExpansion = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const settings = {
    adaptiveHeight: true,
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

  const EventCard: React.FC<{ event: UpcomingEvent }> = ({ event }) => {
    const isExpanded = expandedEvents.has(event.id);

    return (
      <Card
        sx={{
          marginBottom: 1,
          borderRadius: "0px",
          border: "none",
          display: "flex",
          flexDirection: "row",
          boxShadow: "none",
          gap: 0,
        }}
      >
        {/* Date Box */}
        <Box
          sx={{
            height: "100%",
            backgroundColor: theme.palette.background.paper,
            border: `0.5px solid ${theme.palette.text.secondary}`,
            padding: "12px 12px",
            textAlign: "center",
            minWidth: "50px",
            marginRight: 0.5,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: "14px",
              color: theme.palette.text.primary,
              lineHeight: "16px",
            }}
          >
            {event.date}
          </Typography>
        </Box>
        <CardContent
          sx={{
            padding: "2px 16px !important",
            cursor: "pointer",
            backgroundColor: "#E7CEF3",
            flex: 1,
          }}
          onClick={() => toggleEventExpansion(event.id)}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" flex={1}>
              {/* Event Title */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: theme.palette.text.primary,
                  flex: 1,
                }}
              >
                {event.title}
              </Typography>
            </Box>

            {/* Expand/Collapse Icon */}
            <IconButton
              size="small"
              sx={{
                color: theme.palette.text.primary,
                padding: "4px",
              }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {/* Expanded Content */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: "14px",
                  lineHeight: "20px",
                  marginBottom: 1,
                }}
              >
                {event.description}
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  const MonthSlide: React.FC<{ monthData: MonthEvents }> = ({ monthData }) => (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        border: `2px solid ${theme.palette.primary.main}`,
        p: 2,
      }}
    >
      {/* Month Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          {monthData.month}
        </Typography>
      </Box>

      {/* Events List */}
      <Box>
        {monthData.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </Box>
    </Box>
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
          Upcoming
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
      <Box
      //   sx={{ height: "300px" }}
      >
        <Slider {...settings} ref={sliderRef}>
          {dummyUpcomingEvents.map((monthData) => (
            <Box
              key={`${monthData.month}-${monthData.year}`}
              sx={{ height: "100%", px: 1 }}
            >
              <motion.div
                variants={carouselSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ height: "100%" }}
              >
                <MonthSlide monthData={monthData} />
              </motion.div>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default UpcomingEvents;
