import { Box, Typography, IconButton } from "@mui/material";
import Header from "../../components/layout/Header";
import { useTheme } from "@mui/material/styles";
import DailyPulse from "./DailyPulse";
import StatusPanel from "../../features/user/components/StatusPanel";
// import MissionMillion from "../../features/user/components/MisssionMillion";
import ToggleBar from "../../features/user/components/ToggleBar";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import ContinueLearning from "../../features/user/components/ContinueLearning";
import AnimateOnScroll from "../../animation/AnimateOnScroll";
import { baseTransition } from "../../animation/transitions/baseTransition";
import { fadeInUp } from "../../animation/variants/fadeInUp";
// import AnimateNumber from "../../animation/AnimateNumber";
// import ResultsAnounced from "../../components/ui/ResultsAnounced";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import Upcoming_Event from "../../features/user/components/Upcoming_Event";
import Quickk from "../../components/ui/Quickk";
import TopStatusPanel from "../../features/user/components/TopStatusPanel";
import StarsEarnedPopup from "../../components/ui/StarsEarnedPopup";

const Dashboard = () => {
  const { name } = useSelector((state: RootState) => state.user);
  const theme = useTheme();
  const [showStarsPopup, setShowStarsPopup] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if we should show stars popup from localStorage
    const shouldShowStars = localStorage.getItem("showStarsPopup");
    if (shouldShowStars === "true") {
      setShowStarsPopup(true);
    }
  }, []);

  const handleCloseStarsPopup = () => {
    setShowStarsPopup(false);
    // Remove flag from localStorage
    localStorage.removeItem("showStarsPopup");
  };

  return (
    <Box color="#000" py={"30px"}>
      {/* Header */}
      <Header />

      {/* Greeting */}
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        px={"20px"}
      >
        <Box>
          <Typography mt={"40px"} variant="h2">
            Hello,
            <br />
            {name}
          </Typography>
          <Box
            border={`2px solid ${theme.palette.primary.main}`}
            width={"fit-content"}
            px={1}
            mt={1}
          >
            <Typography color={"black"} fontSize={14}>
              Weben Club Member
            </Typography>
          </Box>
        </Box>
        <IconButton sx={{ color: "#000" }}>
          <NotificationsNoneOutlinedIcon />
        </IconButton>
      </Box>

      {/* Learnings and Challenges */}
      {/* <Stack direction="row" mt={"16px"}>
        <Box
          flex={1}
          bgcolor={"#D9D9D9"}
          alignContent={"center"}
          p={"16px"}
          color={"black"}
        >
          <Typography variant="h1" fontSize={25}>
            <AnimateNumber target={15}></AnimateNumber>
          </Typography>

          <Typography fontSize={20} fontWeight="500">
            Referrals
          </Typography>
        </Box>
        <Box
          flex={1}
          bgcolor={theme.palette.text.secondary}
          alignContent={"center"}
          p={"12px 20px"}
          color={"white"}
        >
          <Typography variant="h1" fontSize={25}>
            <AnimateNumber target={9}></AnimateNumber>
          </Typography>
          <Typography fontSize={20} fontWeight="500">
            Connections
          </Typography>
        </Box>
      </Stack> */}

      <Box mt={"25px"}>
        <TopStatusPanel />
      </Box>

      {/* Daily Pulse */}
      {/* <AnimateOnScroll transition={baseTransition} variants={fadeInRight}> */}
      <Box mt={"52px"} pt={"30px"}>
        <DailyPulse />
      </Box>
      {/* </AnimateOnScroll> */}

      {/* Status Panel */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"60px"}>
          <StatusPanel />
        </Box>
      </AnimateOnScroll>

      {/* <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"48px"}>
          <Upcoming_Event />
        </Box>
      </AnimateOnScroll> */}

      {/* Continue Learning */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"48px"}>
          <ContinueLearning />
        </Box>
      </AnimateOnScroll>

      {/* <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"4px"}>
          <BottomNavigation />
        </Box>
      </AnimateOnScroll> */}

      {/* <Box
        position="sticky"
        top={0}
        zIndex={1000}
        bgcolor="#0E0E0E"
        overflow={"hidden"}
      >
        <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
          <ResultsAnounced />
        </AnimateOnScroll>
      </Box> */}

      {/* Mission Million */}
      {/* <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"60px"} px={"20px"}>
          <MissionMillion />
        </Box>
      </AnimateOnScroll> */}

      {/* ToggleBar */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"60px"} px={"30px"} mb={"30px"} display={"flex"}>
          <ToggleBar />
          <Quickk />
        </Box>
      </AnimateOnScroll>

      {/* Stars Earned Popup */}
      <StarsEarnedPopup
        open={showStarsPopup}
        stars={50}
        onClose={handleCloseStarsPopup}
      />
    </Box>
  );
};

export default Dashboard;
