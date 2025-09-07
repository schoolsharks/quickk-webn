import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BottomNavigation from "../../../components/ui/BottomNavigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetEventByIdQuery } from "../services/eventsApi";
import ErrorLayout from "../../../components/ui/Error";
import Loader from "../../../components/ui/Loader";
import formatEventTime from "../../../utils/formatEventTime";
import { extractFullDateWithDay } from "../../../utils/dateExtract";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const PurchaseSuccess: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { eventId } = useParams();
  // const [searchParams] = useSearchParams();

  const user = useSelector((state: RootState) => state.user);
  const {
    data: EventData,
    isError,
    isLoading,
  } = useGetEventByIdQuery(eventId, { skip: !eventId });

  const handleBack = () => {
    navigate(-1);
  };

  // Get quantity and amount from URL params (passed from previous page)
  // const quantity = searchParams.get("quantity") || "1";
  // const amount = searchParams.get("amount") || "500";

  // Generate order number (could use quantity/amount for more complex logic)
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  // TODO: Add Calendar functionality later
  // const handleAddToCalendar = () => {
  //   console.log("Add to calendar functionality will be added later");
  // };

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

  // TODO: Get user email from auth context
  const userEmail = user?.companyMail || "";

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Success Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Button
          onClick={handleBack}
          sx={{
            minWidth: "auto",
            p: 1,
            color: theme.palette.text.primary,
          }}
        >
          <ArrowBackIcon />
        </Button>
        <Typography
          variant="h4"
          sx={{
            ml: 2,
            fontWeight: 500,
            color: theme.palette.text.primary,
          }}
        >
          {EventData.title}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#CD7BFF40",
          px: 3,
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: "25px",
            mb: 1,
          }}
        >
          Thanks for your order!
        </Typography>
        {/* <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 700,
            color: theme.palette.text.secondary,
          }}
        >
          Order no
        </Typography> */}
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          {orderNumber}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, pb: 10 }}>
        {/* Event Info */}
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontSize: "16px",
            mb: 1,
          }}
        >
          You are going to
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontSize: "25px",
            mb: 1,
          }}
        >
          {EventData.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            mb: 6,
          }}
        >
          By {EventData.organizer}
        </Typography>

        {/* Ticket Delivery Info */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              mb: 0.5,
            }}
          >
            Ticket sent to
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            {userEmail}
          </Typography>
        </Box>

        {/* Date and Time */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              mb: 0.5,
            }}
          >
            Date and Time
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CalendarTodayOutlinedIcon
              sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: 16 }}
            />
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              {(() => {
                const date = extractFullDateWithDay(EventData?.startDate || "");
                return `${date}`;
              })()}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, ml: 3 }}
          >
            {eventTime}
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              mb: 0.5,
            }}
          >
            Location
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOnOutlinedIcon
              sx={{ color: theme.palette.text.secondary, mr: 1, fontSize: 16 }}
            />
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              {EventData.location}
            </Typography>
          </Box>
        </Box>

        {/* TODO: Add Calendar Button - Will be implemented later */}
        {/* 
        <Button
          onClick={handleAddToCalendar}
          fullWidth
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "16px",
            padding: "12px",
            borderRadius: "8px",
            mb: 2,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Add to Calendar
        </Button>
        */}
      </Box>

      {/* Bottom Navigation */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <BottomNavigation />
      </Box>
    </Box>
  );
};

export default PurchaseSuccess;
