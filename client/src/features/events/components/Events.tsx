import { Box } from "@mui/material";
import EventsToday from "./EventsToday";
import UpcomingEvents from "./UpcomingEvents";
// import Recordings from "./Recordings";

const Events = () => {
  return (
    <Box p={"8px 26px"} display={"flex"} flexDirection={"column"} gap={8}>
      <EventsToday />
      <UpcomingEvents />
      {/* <Recordings /> */}
    </Box>
  );
};

export default Events;
