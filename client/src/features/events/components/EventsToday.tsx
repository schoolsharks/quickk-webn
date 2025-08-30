import { Box, Typography, Card, CardContent } from "@mui/material";
import React from "react";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../../../components/ui/button";
import event from "../../../assets/images/Onboardinghead.png";

// Dummy data - replace with RTK Query later
const dummyEventData = {
  date: new Date(), // Today's date
  topic: "Pitch & Prosper 2025",
  city: "Mumbai",
  time: "10:00pm - 6:00pm",
  interestedCount: 200,
  image: event,
};

const EventsToday: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Format today's date
  const today = new Date();
  const dayNumber = today.getDate();
  const monthName = today
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  const handleInterestedClick = () => {
    // Navigate to event details page
    navigate("/user/events/1"); // Using fixed ID as discussed
  };

  return (
    <Box mt={6}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          Today
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
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `url(${dummyEventData.image})`,
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
                {dummyEventData.topic}
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
              {dummyEventData.city}
            </Typography>
            <Box display={"flex"} justifyContent="space-between" width={"100%"}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "14px",
                }}
              >
                {dummyEventData.time}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.light,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                +{dummyEventData.interestedCount} interested
              </Typography>
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

export default EventsToday;
