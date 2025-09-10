import React, { useEffect } from "react";
import { Box, Typography, IconButton, Grid, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { theme } from "../../../theme/theme";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { useNavigate } from "react-router-dom";
import { extractTimeInAmPm } from "../../../utils/dateExtract";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import AnimateOnScroll from "../../../animation/AnimateOnScroll";
import { fadeInLeft, fadeInRight, fadeInUp } from "../../../animation";
import { baseTransition } from "../../../animation/transitions/baseTransition";
import ResultsAnounced from "../../../components/ui/ResultsAnounced";

interface Reward {
  image: string;
  title?: string;
  ticketCost: number;
  resultTime?: string;
  id?: string;
}

interface RewardsScreenProps {
  liveReward: Reward[];
  upcomingRewards: Reward[];
}

export const RewardsLayout: React.FC<RewardsScreenProps> = ({
  liveReward,
  upcomingRewards,
}) => {
  const navigate = useNavigate();
  const { totalStars, redeemedStars } = useSelector(
    (state: RootState) => state.user
  );

  const naviagteTickets = () => {
    navigate("/user/mytickets");
  };
  const navigateHome = () => {
    navigate("/user/dashboard");
  };
  const navigateToBuyReward = () => {
    navigate(`/user/buyReward/${currentLiveReward.id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentLiveReward = liveReward[0] || []; // Use the 0th element of the liveReward array
  const time = currentLiveReward.resultTime
    ? extractTimeInAmPm(currentLiveReward?.resultTime)
    : "0";

  return (
    <Box sx={{ color: "text.primary", pb: "50px", pt: "30px" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: "16px",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" onClick={navigateHome}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ ml: 1 }}>
            Rewards
          </Typography>
        </Box>
        <IconButton color="inherit">
          <InfoOutlinedIcon />
        </IconButton>
      </Box>
      <Box
        position={"absolute"}
        zIndex={2}
        sx={{
          width: "80%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
          padding: "0 0px",
        }}
      >
        <Typography fontSize={"22px"} fontWeight={"700"}>
          ✨ Something exciting is brewing!
        </Typography>
        <Typography fontSize={"18px"} fontWeight={"500"}>
          Keep earning stars, your rewards will unlock soon.
        </Typography>
      </Box>
      <Box sx={{ filter: "blur(6px)" }}>
        {/* Stars Counter */}
        <Grid container mt={"30px"}>
          <Grid
            size={6}
            sx={{ p: 2, textAlign: "center" }}
            bgcolor={theme.palette.background.paper}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {/* need to check here  */}
              {totalStars || 0}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Total Stars
            </Typography>
          </Grid>
          <Grid
            size={6}
            sx={{ p: 2, textAlign: "center" }}
            bgcolor={"rgba(37, 37, 37, 1)"}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {redeemedStars || 0}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Stars Placed
            </Typography>
          </Grid>
        </Grid>

        {/* My Tickets section */}
        <Button
          fullWidth
          onClick={naviagteTickets}
          sx={{
            display: "flex",
            borderRadius: "0",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            bgcolor: "primary.main",
            color: "black",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            My Tickets
          </Typography>
          <ArrowForwardIcon />
        </Button>

        <Box mt="20px">
          <ResultsAnounced />
        </Box>

        {/* Live Reward */}
        <AnimateOnScroll variants={fadeInUp} transition={baseTransition}>
          <Box sx={{ px: "12px" }} mt={"20px"}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="body1" sx={{ mb: 1 }}>
                Live reward
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.primary.main, mb: 1 }}
              >
                {time}
              </Typography>
            </Box>

            <Box sx={{ position: "relative" }}>
              <Box
                component="img"
                src={currentLiveReward.image}
                alt={"Live reward"}
                sx={{
                  width: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.9)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bgcolor: theme.palette.primary.main,
                  bottom: 15,
                  left: 11,
                  fontWeight: 600,
                  fontSize: "16px",
                  p: "12px",
                  color: "black",
                  width: "max-content",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={navigateToBuyReward}
              >
                Participate - Ticket {currentLiveReward.ticketCost}
                <StarsOutlinedIcon />
              </Box>
            </Box>
          </Box>
        </AnimateOnScroll>

        {/* Upcoming Rewards */}
        <Box sx={{ px: "12px" }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Upcoming rewards
          </Typography>

          <Grid container spacing={2}>
            {upcomingRewards.map((reward, index) => (
              <Grid size={6} key={index}>
                <AnimateOnScroll
                  variants={index % 2 == 0 ? fadeInLeft : fadeInRight}
                  transition={baseTransition}
                >
                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Box
                      component="img"
                      src={reward.image}
                      alt={reward.title}
                      sx={{
                        width: "100%",
                        height: 150,
                      }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        bgcolor: theme.palette.primary.main,
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        fontWeight: 600,
                        fontSize: "16px",
                        py: "2px",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      Ticket {reward.ticketCost}
                      <StarsOutlinedIcon />
                    </Box>
                  </Box>
                </AnimateOnScroll>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default RewardsLayout;
