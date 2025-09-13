import { Box, Typography } from "@mui/material";
// import EventsToday from "./EventsToday";
// import UpcomingEvents from "./UpcomingEvents";
// import InterestingEvent from "./InterestingEvent";
// import Recordings from "./Recordings";

const Events = () => {
  return (
    <Box>
      <Box
        position={"absolute"}
        zIndex={2}
        sx={{
          width: "80%",
          left: "50%",
          top: "80%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
          padding: "0 0px",
        }}
      >
        <Typography fontSize={"22px"} fontWeight={"700"}>
          Events are on the way — make sure you’re ready when they drop!
        </Typography>
      </Box>
      <Box
        p={"8px 26px 60px 26px"}
        display={"flex"}
        flexDirection={"column"}
        minHeight={"40vh"}
        gap={8}
      >
        {/* <EventsToday /> */}
        {/* <InterestingEvent /> */}
        {/* <UpcomingEvents /> */}
        {/* <Recordings /> */}
      </Box>
    </Box>
  );
};

export default Events;
