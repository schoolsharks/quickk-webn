import { Box, Typography, Stack } from "@mui/material";
import Header from "../../components/layout/Header";
import { useTheme } from "@mui/material/styles";
import DailyPulse from "./DailyPulse";
import StatusPanel from "../../features/user/components/StatusPanel";
import BidCard from "../../features/user/components/BidCard";
import MissionMillion from "../../features/user/components/MisssionMillion";
import ToggleBar from "../../features/user/components/ToggleBar";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect } from "react";
import ContinueLearning from "../../features/user/components/ContinueLearning";
import AnimateOnScroll from "../../animation/AnimateOnScroll";
import { baseTransition } from "../../animation/transitions/baseTransition";
import { fadeInRight, fadeInUp } from "../../animation/variants/fadeInUp";
import AnimateNumber from "../../animation/AnimateNumber";
import ResultsAnounced from "../../components/ui/ResultsAnounced";

const Dashboard = () => {
  const { name } = useSelector((state: RootState) => state.user);
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box color="#fff" py={"30px"}>
      {/* Header */}
      <Header />

      {/* Greeting */}
      <Typography mt={"40px"} variant="h2" px={"20px"}>
        Hello,
        <br />
        {name}
      </Typography>

      {/* Learnings and Challenges */}
      <Stack direction="row" mt={"16px"}>
        <Box
          flex={1}
          bgcolor={theme.palette.primary.main}
          alignContent={"center"}
          p={"16px"}
          color={"black"}
        >
          <Typography variant="h1">
            <AnimateNumber target={15}></AnimateNumber>
          </Typography>

          <Typography fontSize={25} fontWeight="500">
            Learnings
          </Typography>
        </Box>
        <Box
          flex={1}
          bgcolor="#3B3B3B"
          p={"16px"}
          color={"white"}
          alignContent={"center"}
        >
          <Typography variant="h1">
            <AnimateNumber target={1}></AnimateNumber>
          </Typography>
          <Typography fontSize={25} fontWeight="500">
            Challenges
          </Typography>
        </Box>
      </Stack>

      {/* Daily Pulse */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInRight}>
        <Box mt={"52px"}>
          <DailyPulse />
        </Box>
      </AnimateOnScroll>

      {/* Continue Learning */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <ContinueLearning />
      </AnimateOnScroll>

      {/* Status Panel */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"60px"} mb={"20px"}>
          <StatusPanel />
        </Box>
      </AnimateOnScroll>

      <Box
        position="sticky"
        top={0}
        zIndex={1000}
        bgcolor="#0E0E0E"
        overflow={"hidden"}
      >
        <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
          <ResultsAnounced />
        </AnimateOnScroll>
      </Box>

      {/* Bid Card */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"60px"}>
          <BidCard />
        </Box>
      </AnimateOnScroll>

      {/* Mission Million */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"60px"} px={"20px"}>
          <MissionMillion />
        </Box>
      </AnimateOnScroll>

      {/* ToggleBar */}
      <AnimateOnScroll transition={baseTransition} variants={fadeInUp}>
        <Box mt={"60px"} px={"30px"} mb={"30px"}>
          <ToggleBar />
        </Box>
      </AnimateOnScroll>
    </Box>
  );
};

export default Dashboard;
