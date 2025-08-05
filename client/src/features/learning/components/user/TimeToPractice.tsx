import { Box, Typography } from "@mui/material";
import React from "react";
import QemojiImage from "./Qemoji";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../../../../components/ui/button";

const TimeToPractice: React.FC<{ moduleId?: string }> = ({ moduleId }) => {
  const navigate = useNavigate();
  return (
    <Box display={"flex"} p={"160px 42px 148px 42px"} flexDirection={"column"}>
      <Box mx={"auto"}>
        <QemojiImage width="208px" height="208px" />
      </Box>
    
      <Box mx={"auto"}>
        <Typography variant="h5" mt={"54px"} textAlign={"center"}>
          Well done!
        </Typography>
        <Typography variant="h2" mt={3}>
          Time to practice
        </Typography>
      </Box>

      <GlobalButton
        onClick={() => {
          navigate(`/user/assessment/${moduleId}`);
        }}
        sx={{ mt: "148px" }}
      >
        Let’s Go
      </GlobalButton>
    </Box>
  );
};

export default TimeToPractice;
