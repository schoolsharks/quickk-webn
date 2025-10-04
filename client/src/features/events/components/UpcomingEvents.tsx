import React, { useState } from "react";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  // IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselSlide } from "../../../animation/variants/slideCarousel";

import formatEventTime from "../../../utils/formatEventTime";

// API Response types
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
interface UpcomingEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  time?: string;
  fullData: ApiEvent;
}

interface MonthEvents {
  month: string;
  year: number;
  events: UpcomingEvent[];
}

interface UpcomingEventsProps {
  showScore?: boolean;
  eventsData: any[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  showScore = true,
  eventsData,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [expandedEvents, _setExpandedEvents] = useState<Set<string>>(new Set());
  const sliderRef = React.useRef<Slider | null>(null);
  const EventData = eventsData || [];

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Transform API data to component format and group by month
  const groupedEvents = React.useMemo(() => {
    if (!EventData || !Array.isArray(EventData)) return [];

    const grouped: { [key: string]: MonthEvents } = {};

    EventData.forEach((apiEvent: ApiEvent) => {
      const startDate = new Date(apiEvent.startDate);
      const monthYear = `${startDate.toLocaleString("default", {
        month: "long",
      })}-${startDate.getFullYear()}`;

      const transformedEvent: UpcomingEvent = {
        id: apiEvent._id,
        date:
          startDate.getDate().toString() +
          getOrdinalSuffix(startDate.getDate()),
        title: apiEvent.title,
        description: apiEvent.description,
        location: apiEvent.location,
        time: formatEventTime(apiEvent.startDate, apiEvent.endDate),
        fullData: apiEvent,
      };

      if (!grouped[monthYear]) {
        grouped[monthYear] = {
          month: startDate.toLocaleString("default", { month: "long" }),
          year: startDate.getFullYear(),
          events: [],
        };
      }

      grouped[monthYear].events.push(transformedEvent);
    });

    // Sort events within each month by date
    Object.values(grouped).forEach((monthData) => {
      monthData.events.sort((a, b) => {
        const aDate = new Date(a.fullData.startDate);
        const bDate = new Date(b.fullData.startDate);
        return aDate.getTime() - bDate.getTime();
      });
    });

    return Object.values(grouped).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return (
        new Date(`${a.month} 1, ${a.year}`).getMonth() -
        new Date(`${b.month} 1, ${b.year}`).getMonth()
      );
    });
  }, [EventData]);

  // const toggleEventExpansion = (eventId: string) => {
  //   const newExpanded = new Set(expandedEvents);
  //   if (newExpanded.has(eventId)) {
  //     newExpanded.delete(eventId);
  //   } else {
  //     newExpanded.add(eventId);
  //   }
  //   setExpandedEvents(newExpanded);
  // };

  const handleEventClick = (eventId: string) => {
    // Navigate to event details page
    navigate(`/user/events/${eventId}`);
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
          width: 9,
          height: 9,
          bgcolor: theme.palette.text.primary,
          borderRadius: "0",
          transition: "all 0.4s",
        }}
      />
    ),
  };
  if (!EventData || EventData.length === 0) {
    return null;
  }

  if (groupedEvents.length === 0) {
    return (
      <Box width="100%">
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
            No upcoming events found
          </Typography>
        </Box>
      </Box>
    );
  }

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
          onClick={() => handleEventClick(event.id)}
          sx={{
            height: "100%",
            backgroundColor: theme.palette.background.paper,
            // border: `0.5px solid ${theme.palette.text.secondary}`,
            padding: "12px 12px",
            textAlign: "left",
            minWidth: "70px",
            marginRight: 0.5,
            cursor: "pointer",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: "18px",
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
            // backgroundColor: "#E7CEF3",
            flex: 1,
          }}
          onClick={() => handleEventClick(event.id)}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box
              display="flex"
              alignItems="center"
              flex={1}
              justifyContent={"center"}
            >
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
            {/* <IconButton
              size="small"
              sx={{
                color: theme.palette.text.primary,
                padding: "4px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleEventExpansion(event.id);
              }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton> */}
          </Box>

          {/* Expanded Content */}
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 1, pb: 1 }}>
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

              {/* Additional event details */}
              {event.location && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "12px",
                    marginBottom: 0.5,
                  }}
                >
                  📍 {event.location}
                </Typography>
              )}

              {event.time && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "12px",
                    marginBottom: 0.5,
                  }}
                >
                  🕒 {event.time}
                </Typography>
              )}

              {event.fullData.interestedCount > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "12px",
                    marginBottom: 0.5,
                  }}
                >
                  👥 {event.fullData.interestedCount.toLocaleString()}{" "}
                  interested
                </Typography>
              )}

              {event.fullData.organizer && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "12px",
                  }}
                >
                  🏢 Organized by {event.fullData.organizer}
                </Typography>
              )}
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
        {monthData.events.map((event, idx) => (
          <>
            <EventCard key={event.id} event={event} />
            {idx === monthData.events.length - 1 ? null : (
              <Box
                flex={1}
                mx={"8px"}
                height={"1px"}
                my="16px"
                sx={{
                  background:
                    "linear-gradient(90deg, rgba(205, 123, 255, 0.3) 0%, #A04AD4 49.52%, rgba(205, 123, 255, 0.3) 99.04%)",
                }}
              />
            )}
          </>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box width="100%" mb={10}>
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
          {groupedEvents.map((monthData) => (
            <Box
              key={`${monthData.month}-${monthData.year}`}
              sx={{ height: "100%" }}
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
