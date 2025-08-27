import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { RootState } from "../../../app/store";
// import AnimateNumber from "../../../animation/AnimateNumber";

const ContinueLearning: React.FC = () => {
  // const { progress } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  const handleLearningClick = () => {
    navigate("/user/learning");
  };
  const theme = useTheme();
  return (
    <Box
      // mt={"90px"}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      onClick={handleLearningClick}
      bgcolor={theme.palette.secondary.main}
      p={"38px 20px"}
      sx={{ cursor: "pointer" }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography
          variant="h2"
          fontSize={"20px"}
          color="#000"
          sx={{ textWrap: "nowrap" }}
        >
          Learning & Training Modules
        </Typography>
        <CallMadeOutlinedIcon sx={{ fontSize: 35 }} />
      </Box>
      {/* <Typography variant="subtitle1" color="#404040" display={"flex"}>
        <AnimateNumber target={progress || 0}></AnimateNumber>%
      </Typography> */}
    </Box>
  );
};

export default ContinueLearning;
