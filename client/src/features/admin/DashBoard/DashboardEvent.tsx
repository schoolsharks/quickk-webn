import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import Loader from "../../../components/ui/Loader";
import ErrorLayout from "../../../components/ui/Error";
import formatEventTime from "../../../utils/formatEventTime";
import { Download } from "@mui/icons-material";
import {
  useGetActiveEventsQuery,
  useGetUpcomingEventsQuery,
} from "../../events/services/eventsApi";

const DashboardEvent: React.FC = () => {
  const theme = useTheme();
  const {
    data: miscellaneousEventData,
    isError: isMiscellaneousError,
    isLoading: isMiscellaneousLoading,
  } = useGetActiveEventsQuery({ type: "miscellaneous" });

  const {
    data: upcomingEventsData,
    isError: isUpcomingError,
    isLoading: isUpcomingLoading,
  } = useGetUpcomingEventsQuery(undefined, {
    skip: !!miscellaneousEventData, // Only fetch if no miscellaneous event
  });

  // Determine which event to display
  const EventData =
    miscellaneousEventData ||
    (upcomingEventsData && upcomingEventsData.length > 0
      ? upcomingEventsData[0]
      : null);
  const isLoading = isMiscellaneousLoading || isUpcomingLoading;
  const isError = isMiscellaneousError && isUpcomingError;
  // Format today's date

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorLayout />;
  }
  //   const today = new Date();
  const dayNumber = new Date(EventData?.startDate).getDate();
  const monthName = new Date(EventData?.startDate)
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  // Handle case when no events are available
  if (!isLoading && !EventData) {
    return (
      <Box
        p="24px"
        border={`1px solid ${theme.palette.primary.main}`}
        height={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
            Upcoming
          </Typography>
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            sx={{ color: theme.palette.text.primary }}
          >
            10
            <Download sx={{ ml: 0.5, fontSize: "24px" }} />
          </Typography>
        </Box>
        <Card
          sx={{
            borderRadius: "0",
            overflow: "hidden",
            border: `2px solid ${theme.palette.primary.main}`,
            textAlign: "center",
            padding: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: theme.palette.text.secondary, mb: 2 }}
          >
            No Events Available
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            There are no events scheduled for today or upcoming.
          </Typography>
        </Card>
      </Box>
    );
  }

  const eventTime =
    EventData?.startDate && EventData?.endDate
      ? formatEventTime(EventData.startDate, EventData.endDate)
      : EventData?.time || "";

  return (
    <Stack
      pt={"24px"}
      height={"100%"}
      border={`1px solid ${theme.palette.primary.main}`}
    >
      <Box
        display="flex"
        px={"24px"}
        justifyContent="space-between"
        alignItems="center"
        // mb={1}
      >
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          Upcoming Event
        </Typography>
        <Typography
          variant="h4"
          display="flex"
          alignItems="center"
          sx={{ color: theme.palette.text.primary }}
        >
          <Download sx={{ ml: 0.5, fontSize: "24px" }} />
        </Typography>
      </Box>

      <Stack flex={1} px={"60px"} my={4}>
        <Card
          sx={{
            borderRadius: "0",
            overflow: "hidden",
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        >
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
            {/* Date Badge */}
            <Box
              zIndex={10}
              sx={{
                backgroundColor: "black",
                color: theme.palette.background.paper,
                borderRadius: "0px",
                p: "8px",
                textAlign: "center",
                minWidth: "50px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: "20px",
                  lineHeight: "24px",
                  margin: 0,
                }}
              >
                {dayNumber}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "14px",
                  margin: 0,
                }}
              >
                {monthName}
              </Typography>
            </Box>

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
                backgroundImage: `url(${EventData?.eventImage})`,
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
                  {EventData?.title || "Event Title"}
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
                {EventData?.location || "Location"}
              </Typography>
              <Box
                display={"flex"}
                justifyContent="space-between"
                width={"100%"}
              >
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
                  +{EventData?.interestedCount || 0} interested
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>
      <Box bgcolor={"#404040"} p={2}>
        <Typography variant="h4" color="white" textAlign={"center"}>
          {EventData?.interestedCount + " Attending"}
        </Typography>
      </Box>
    </Stack>
  );
};

export default DashboardEvent;
