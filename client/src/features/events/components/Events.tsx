import { Box } from "@mui/material";
// import EventsToday from "./EventsToday";
// import UpcomingEvents from "./UpcomingEvents";
import InterestingEvent from "./InterestingEvent";
// import Recordings from "./Recordings";

const Events = () => {
  return (
    // <Box position={"relative"}>
    //   <Box
    //     position={"absolute"}
    //     zIndex={2}
    //     sx={{
    //       width: "100%",
    //       mx: "auto",
    //       left: "50%",
    //       top: "60%",
    //       transform: "translate(-50%,-50%)",
    //       textAlign: "center",
    //       padding: "0 0px",
    //     }}
    //   >
    //     <Typography
    //       mx={"22px"}
    //       fontSize={"22px"}
    //       fontWeight={"700"}
    //       sx={{ textWrap: "wrap" }}
    //     >
    //       Events are on the way — make sure you’re ready when they drop!
    //     </Typography>
    //   </Box>
    <Box
      p={"8px 26px 60px 26px"}
      display={"flex"}
      flexDirection={"column"}
      minHeight={"40vh"}
      gap={8}
    >
      {/* <EventsToday /> */}
      <InterestingEvent />
      {/* <UpcomingEvents /> */}
      {/* <Recordings /> */}
    </Box>
    // </Box>
  );
};

export default Events;
