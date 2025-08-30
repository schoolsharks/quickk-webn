import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useGetUpcomingRewardQuery } from "../../biding/service/bidingApi";
import Loader from "../../../components/ui/Loader";
import { extractTimeAndDate } from "../../../utils/dateExtract";
// import moment from "moment";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
    navigate("/user/reward");
  };
  const theme = useTheme();

  return (
    <Box
      width="100%"
      sx={{ overflow: "hidden", cursor: "pointer" }}
      onClick={handleClick}
    >
      {/* <Box py={"12px"} px={"24px"} display="flex" flexDirection="column">
        <Typography color="white" variant="h4">
          Bid & Win Big! 🔥
        </Typography>
        <Typography color="white" fontSize={14} mt={0.5}>
          Starts at just 100 Stars
        </Typography>
      </Box> */}

      <Box
        display="flex"
        flexDirection="row"
        // sx={{ border: "1px solid #96FF43" }}
        bgcolor={theme.palette.secondary.main}
      >
        <Box
          flex={2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          px={3}
          py={1}
          color={"black"}
        >
          <Typography variant="h4" fontSize={18}>
            Refer & Earn Big! 🔥
          </Typography>
          <Typography variant="h3" mt={0.5}>
            Estimated Value
          </Typography>
          <Typography fontSize={20} fontWeight={600} mt={0.5}>
            ₹ {upcomingReward?.upcomingReward?.estimatedValue ?? "--"}
          </Typography>
          {/* <Typography color="#96FF43" fontSize={18} fontWeight={600} mt={0.7}>
            {countdown}
          </Typography> */}
          <Typography variant="h3" mt={0.5}>
            Announcement on {date}
          </Typography>
          <Typography
            color="rgba(255, 255, 255, 0.6)"
            fontWeight="400"
            fontSize={7}
            mt={0.5}
          >
            *T&C applied
          </Typography>
        </Box>

        <Box
          flex={1.5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            component="img"
            src={upcomingReward?.upcomingReward?.image}
            alt="Image of Upcoming reward."
            sx={{ width: "100%", objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BidCard;
