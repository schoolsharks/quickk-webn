import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React from "react";
// import event from "../../../assets/images/Onboardinghead.png";
import AnimateOnClick from "../../../animation/AnimateOnClick";
import { baseTransition } from "../../../animation/transitions/baseTransition";
import { responseSubmitted } from "../../../animation";
import { useGetActiveEventsQuery } from "../../events/services/eventsApi";
import Loader from "../../../components/ui/Loader";
import ErrorLayout from "../../../components/ui/Error";
import formatEventTime from "../../../utils/formatEventTime";

// const EventData = {
//   date: new Date(), // Today's date
//   topic: "Pitch & Prosper 2025",
//   city: "Mumbai",
//   time: "10:00pm - 6:00pm",
//   interestedCount: 200,
//   image: event,
// };

const Upcoming_Event: React.FC = () => {
  const { data: EventData, isError, isLoading } = useGetActiveEventsQuery({});
  const theme = useTheme();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !EventData) {
    return <ErrorLayout />;
  }

  const eventTime =
    EventData?.startDate && EventData?.endDate
      ? formatEventTime(EventData.startDate, EventData.endDate)
      : EventData?.time || "";

  return (
    <Card
      sx={{
        borderRadius: "0",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `2px solid ${theme.palette.primary.main}`,
        height: "100%",
      }}
    >
      <Box>
        {/* Date Section */}
        <Box
          sx={{
            position: "relative",
            height: "200px",
            background: `linear-gradient(135deg, ${theme.palette.primary.light}40, ${theme.palette.primary.main}40)`,
            display: "flex",
            alignItems: "flex-start",
            padding: 2,
          }}
        >
          {/* Dummy Image Placeholder */}
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              left: 0,
              backgroundColor: theme.palette.background.default,
              borderRadius: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `url(${EventData.eventImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></Box>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ padding: "16px !important" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexDirection={"column"}
            mb={1}
            gap={1}
          >
            <Box mb={1}>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  fontSize: "25px",
                }}
              >
                {EventData.title}
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                fontSize: "20px",
              }}
            >
              {EventData.location.split(",")[2]}
            </Typography>
            <Box display={"flex"} justifyContent="space-between" width={"100%"}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "14px",
                }}
              >
                {eventTime}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.light,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                +{EventData.interestedCount} interested
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Box>

      {/* Interested Button */}
      <Box display="flex" sx={{ cursor: "pointer" }} fontSize={"15px"}>
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py="18px"
            bgcolor={"#A8A6A7"}
            color={"black"}
            onClick={() => {}}
            fontSize={"30px"}
          >
            Yes
          </Box>
        </AnimateOnClick>
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py="18px"
            color={"white"}
            bgcolor="#000000"
            onClick={() => {}}
            fontSize={"30px"}
          >
            No
          </Box>
        </AnimateOnClick>
      </Box>
    </Card>
  );
};

export default Upcoming_Event;
