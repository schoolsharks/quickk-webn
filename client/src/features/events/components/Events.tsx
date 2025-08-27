import { Box } from "@mui/material";
import EventsToday from "./EventsToday";
import UpcomingEvents from "./UpcomingEvents";
import Recordings from "./Recordings";
import Quickk from "../../../components/ui/Quickk";

const Events = () => {
  return (
    <Box p={"8px 26px"} display={"flex"} flexDirection={"column"} gap={6}>
      <EventsToday />
      <UpcomingEvents />
      <Recordings />
      <Quickk />
    </Box>
  );
};

export default Events;
