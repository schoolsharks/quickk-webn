import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useGetUpcomingRewardQuery } from "../../biding/service/bidingApi";
import Loader from "../../../components/ui/Loader";
import { extractTimeAndDate } from "../../../utils/dateExtract";
// import moment from "moment";
// import { useNavigate } from "react-router-dom";

const BidCard: React.FC = () => {
  const {
    data: upcomingReward,
    isLoading,
    error,
  } = useGetUpcomingRewardQuery({});

  const {
    // time,
    date,
  } = extractTimeAndDate(upcomingReward?.upcomingReward?.startTime);
  // const [countdown, setCountdown] = useState("");
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!upcomingReward?.upcomingReward?.startTime) return;

  //   const target = moment(upcomingReward.upcomingReward.startTime);

  //   const interval = setInterval(() => {
  //     const now = moment();
  //     const diff = moment.duration(target.diff(now));

  //     if (diff.asMilliseconds() <= 0) {
  //       setCountdown("00:00:00");
  //       clearInterval(interval);
  //       return;
  //     }

  //     const formatted = `${String(diff.hours()).padStart(2, "0")}:${String(
  //       diff.minutes()
  //     ).padStart(2, "0")}:${String(diff.seconds()).padStart(2, "0")}`;
  //     setCountdown(formatted);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [upcomingReward]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="background.default"
        p={2}
      >
        <Typography color="error">Failed to load Bid Component.</Typography>
      </Box>
    );
  }
  const handleClick = () => {
    // navigate("/user/reward");
  };
  const theme = useTheme();

  return (
    <Box
      width="100%"
      sx={{
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: "white",
        border: `2px solid ${theme.palette.primary.main}`,
        height: "100%",
      }}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      onClick={handleClick}
    >
      {/* Header */}
      <Box>
        <Box px={2} pt={2} pb={2}>
          <Typography variant="h2" color="black" letterSpacing={"-1.1%"}>
            Refer & Earn Big! 🔥
          </Typography>
          <Typography variant="body1" color={"grey"} sx={{ fontSize: "8px" }}>
            *T&C Applied
          </Typography>
        </Box>

        {/* Content */}
        <Box px={2} pb={2}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="body2" color="gray" sx={{ fontSize: "12px" }}>
              Estimated Value
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.primary.main}
              sx={{ fontSize: "12px" }}
            >
              Announcement on
            </Typography>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h5" color="black">
              ₹ {upcomingReward?.upcomingReward?.estimatedValue ?? "14,900"}
            </Typography>
            <Typography variant="h5" color={theme.palette.primary.main}>
              {date || "28th October"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Interested Button */}
      <Box>
        {/* Image */}
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            component="img"
            src={
              upcomingReward?.upcomingReward?.image ||
              "/api/placeholder/120/120"
            }
            alt="Image of Upcoming reward."
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#A8A6A7",
            color: "black",
            fontWeight: "bold",
            fontSize: "30px",
            borderRadius: 0,
            textTransform: "none",
            py: 1.5,
          }}
        >
          Interested
        </Button>
      </Box>
    </Box>
  );
};

export default BidCard;
