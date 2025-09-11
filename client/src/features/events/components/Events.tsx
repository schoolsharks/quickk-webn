import { Box } from "@mui/material";
// import EventsToday from "./EventsToday";
// import UpcomingEvents from "./UpcomingEvents";
import InterestingEvent from "./InterestingEvent";
// import Recordings from "./Recordings";

const Events = () => {
  return (
    <Box
      p={"8px 26px 60px 26px"}
      display={"flex"}
      flexDirection={"column"}
      gap={8}
    >
      {/* <EventsToday /> */}
      <InterestingEvent />
      {/* <UpcomingEvents /> */}
      {/* <Recordings /> */}
    </Box>
  );
};

export default Events;
