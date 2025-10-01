import { Box, Typography, Card, CardContent } from "@mui/material";
import React from "react";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../../../components/ui/button";
import formatEventTime from "../../../utils/formatEventTime";

interface InterestingEventProps {
  eventData: any;
}

const InterestingEvent: React.FC<InterestingEventProps> = ({ eventData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const EventData = eventData;
  // Format today's date
  // const today = new Date();
  // const dayNumber = today.getDate();
  const monthName = EventData?.startDate
    ? new Date(EventData.startDate)
        .toLocaleString("en-US", { month: "short" })
        .toLowerCase()
    : "";
  // today
  //   .toLocaleDateString("en-US", { month: "short" })
  //   .toUpperCase();

  const handleInterestedClick = () => {
    // Navigate to event details page
    navigate(`/user/events/${EventData._id}`);
  };

  if (!EventData) {
    return null; // No upcoming events, component won't be shown
  }

  const eventTime =
    EventData?.startDate && EventData?.endDate
      ? formatEventTime(EventData.startDate, EventData.endDate)
      : EventData?.time || "";

  return (
    <Box mt={6}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          Recent Event
        </Typography>
        <Typography
          variant="h4"
          display="flex"
          alignItems="center"
          sx={{ color: theme.palette.text.primary }}
        >
          10
          <StarsOutlinedIcon sx={{ ml: 0.5, fontSize: "24px" }} />
        </Typography>
      </Box>

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
              backgroundColor: "primary.main",
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
              12
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
              {monthName[0].toUpperCase() + monthName.slice(1)}
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
              {EventData.location}
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
              {/* <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.light,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                +{EventData.interestedCount} interested
              </Typography> */}
            </Box>
          </Box>
        </CardContent>
        {/* Interested Button */}
        <GlobalButton
          onClick={handleInterestedClick}
          fullWidth
          sx={{
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.background.paper,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "16px",
            padding: "12px",
            "&:hover": {
              backgroundColor: theme.palette.text.secondary,
            },
          }}
        >
          Interested
        </GlobalButton>
      </Card>
    </Box>
  );
};

export default InterestingEvent;
