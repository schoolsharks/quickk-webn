import React from "react";
import { Box, Typography } from "@mui/material";
import { useGetMissionMillionQuery } from "../../learning/service/learningApi";
import Loader from "../../../components/ui/Loader";

const MissionMillion: React.FC = () => {
  const targetAmount = "1,00,00,000";
  const {
    data: missionMillionData,
    isLoading,
    error,
  } = useGetMissionMillionQuery({});
  const totalTime = missionMillionData?.data?.totalTime;
  const progress = Math.min(100, Math.floor((totalTime / 10000000) * 100));

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Box
        sx={{
          bgcolor: "#1e1e1e",
          p: 3,
          borderRadius: 2,
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Mission Million Time Not Available
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%">
      {/* Title */}
      <Typography variant="h4" color="white">
        Mission Million 🎯
      </Typography>
      <Typography variant="body1" color="white" mt={0.5}>
        100 mins of learning = 100rs to charity
      </Typography>

      {/* Progress Box */}
      <Box
        mt="28px"
        mx="auto"
        sx={{
          width: 300,
          height: 300,
          position: "relative",
          border: "36px solid #404040",
        }}
      >
        {/* Progress Bar */}
        <Box
          sx={{
            position: "absolute",
            top: -36,
            left: -36,
            height: "36px",
            width: `${progress * 4}%`,
            bgcolor: "primary.main",
            transition: "width 0.7s ease",
          }}
        />

        {/* Centered Text */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography fontSize={35} fontWeight={900} color="white">
            {progress}%
          </Typography>
          <Typography fontSize={25} fontWeight={600} color="white" mt={0.5}>
            {targetAmount}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MissionMillion;
