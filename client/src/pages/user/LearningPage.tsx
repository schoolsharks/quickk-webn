import React from "react";
import LearningLayout from "../../features/learning/components/user/LearningLayout";
import { useGetLearningQuery } from "../../features/learning/service/learningApi";
import { Box, CircularProgress, Typography } from "@mui/material";

const LearningPage: React.FC = () => {
  const { data: learningData, isLoading, error } = useGetLearningQuery({});
    
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !learningData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" p={2}>
        <Typography color="error">Failed to load learning data</Typography>
      </Box>
    );
  }


  return (
    <LearningLayout LearningData={learningData}
    />
  );
};

export default LearningPage;
