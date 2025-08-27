import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import AnimateOnScroll from "../../animation/AnimateOnScroll";
import { fadeInUp } from "../../animation";
import { baseTransition } from "../../animation/transitions/baseTransition";

const ActiveLearning: React.FC = () => {
  const learningStreak = useSelector(
    (state: RootState) => state.user.learningStreak
  );

  return (
    <AnimateOnScroll variants={fadeInUp} transition={baseTransition}>
      <Box
        sx={{
          bgcolor: "#404040",
          p: "14px",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body1" fontSize={"18px"} color="white">
            Active learning {learningStreak} days🔥
          </Typography>
        </Stack>
      </Box>
    </AnimateOnScroll>
  );
};

export default ActiveLearning;
