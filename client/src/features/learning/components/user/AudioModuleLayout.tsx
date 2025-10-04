import { Stack, Typography } from "@mui/material";
import React from "react";
import QemojiImage from "./Qemoji";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../../../../components/ui/button";
import { useMarkVideoCompletedMutation } from "../../service/learningApi";

interface AudioModuleProps {
  moduleId: string;
  isVideoWatched: boolean;
}
const AudioModuleLayout: React.FC<AudioModuleProps> = ({
  moduleId = "",
  isVideoWatched = false,
}) => {
  const [MarkVideoCompleted] = useMarkVideoCompletedMutation();
  const navigate = useNavigate();

  const handleVideoClick = () => {
    navigate(`/user/podcast/${moduleId}`);
    MarkVideoCompleted(moduleId);
  };
  const handleAssessment = () => {
    navigate(`/user/assessment/${moduleId}`);
  };

  return (
    <Stack p={"50px 42px 50px 42px"} maxHeight={window.innerHeight} spacing={0}>
      <Stack gap={"30px"} mx={"auto"}>
        <QemojiImage width="148px" height="148px" sx={{ mx: "auto" }} />
        <Typography variant="h2" textAlign={"center"}>
          Lets Begin with <br/>a Short Audio
        </Typography>
      </Stack>

      <Stack gap={"18px"} mt={"60px"}>
        <GlobalButton onClick={handleVideoClick}>Start</GlobalButton>
        <GlobalButton
          onClick={handleAssessment}
          sx={{ bgcolor: "#3B3B3B", color: "white" }}
          disabled={!isVideoWatched}
        >
          Assessment
        </GlobalButton>
      </Stack>

      <Typography variant="h3" fontSize={"16px"} mt={"30px"}>
        Note : Complete the Podcast to continue with the assessment.
      </Typography>
    </Stack>
  );
};

export default AudioModuleLayout;
