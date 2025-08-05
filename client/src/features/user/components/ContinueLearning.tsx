import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../app/store";
import AnimateNumber from "../../../animation/AnimateNumber";

const ContinueLearning: React.FC = () => {
  const { progress } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  const handleLearningClick = () => {
    navigate("/user/learning");
  };
  return (
    <Box
      mt={"90px"}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      onClick={handleLearningClick}
      bgcolor="#96FF43"
      p={"12px 20px"}
      sx={{ cursor: "pointer" }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h2" fontSize={"25px"} color="#000" sx={{ textWrap: "nowrap" }}>
          Continue Learning
        </Typography>
        <CallMadeOutlinedIcon sx={{ fontSize: 20, color: "#000", mt: "2px" }} />
      </Box>
      <Typography variant="subtitle1" color="#404040" display={"flex"}>
        <AnimateNumber target={progress || 0}></AnimateNumber>%
      </Typography>
    </Box>
  );
};

export default ContinueLearning;
