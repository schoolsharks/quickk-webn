import { Box, Typography } from "@mui/material";
import EventsToday from "./EventsToday";
import UpcomingEvents from "./UpcomingEvents";
import InterestingEvent from "./InterestingEvent";
import Recordings from "./Recordings";
import {
  useGetTodaysEventsQuery,
  useGetUpcomingEventsByDateQuery,
  useGetPastEventsByDateQuery,
} from "../services/eventsApi";
import Loader from "../../../components/ui/Loader";

const Events = () => {
  // Fetch all the data we need to determine what to show
  const { data: todaysEventsData, isLoading: todaysLoading } =
    useGetTodaysEventsQuery({ limit: 10 });

  const { data: upcomingEventsData, isLoading: upcomingLoading } =
    useGetUpcomingEventsByDateQuery({ limit: 10 });

  const { data: pastEventsData, isLoading: pastLoading } =
    useGetPastEventsByDateQuery({ limit: 10 });

  // Show loader while any critical data is loading
  if (todaysLoading || upcomingLoading) {
    return <Loader />;
  }

  // Check if we have any events at all
  const hasTodaysEvents = todaysEventsData?.events?.length > 0;
  const hasUpcomingEvents = upcomingEventsData?.events?.length > 0;
  const hasPastEvents = pastEventsData?.events?.length > 0;
  const hasAnyEvents = hasTodaysEvents || hasUpcomingEvents || hasPastEvents;
  const hasSameEvent = upcomingEventsData?.events?.length === 1;

  // If no events at all, show the fallback message
  if (!hasAnyEvents && !todaysLoading && !upcomingLoading && !pastLoading) {
    return (
      <Box position={"relative"} height={"40vh"}>
        <Box
          position={"absolute"}
          zIndex={2}
          sx={{
            width: "100%",
            mx: "auto",
            left: "50%",
            top: "60%",
            transform: "translate(-50%,-50%)",
            textAlign: "center",
            padding: "0 0px",
          }}
        >
          <Typography
            mx={"22px"}
            fontSize={"22px"}
            fontWeight={"700"}
            sx={{ textWrap: "wrap" }}
          >
            Events are on the way — make sure you're ready when they drop!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      p={"8px 26px 60px 26px"}
      display={"flex"}
      flexDirection={"column"}
      minHeight={"40vh"}
      gap={8}
    >
      {/* Show Today's Events section if we have events today */}
      {hasTodaysEvents && (
        <EventsToday eventData={todaysEventsData.events[0]} />
      )}

      {/* Show Recent/Latest Upcoming Event section if we don't have today's events but have upcoming events */}
      {!hasTodaysEvents && hasUpcomingEvents && (
        <InterestingEvent eventData={upcomingEventsData.events[0]} />
      )}

      {/* Show Upcoming Events section if we have upcoming events */}
      {hasUpcomingEvents && !hasSameEvent && (
        <UpcomingEvents eventsData={upcomingEventsData.events} />
      )}

      {/* Show Recordings section only if we have past events */}
      {hasPastEvents && <Recordings eventsData={pastEventsData.events} />}
    </Box>
  );
};

export default Events;
