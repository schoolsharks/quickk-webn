import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetAssessmentQuestionsQuery, useGetModuleQuery } from '../../features/learning/service/learningApi';
import { Box, CircularProgress, Typography } from '@mui/material';
import AssessmentLayout from '../../features/learning/components/user/AssessmentLayout';

const AssessmentPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  
  const { data: questions, error: assessmentError, isLoading: assessmentLoading } =
    useGetAssessmentQuestionsQuery(moduleId as string);
    
  const { data: module, error: moduleError, isLoading: moduleLoading } =
    useGetModuleQuery(moduleId as string);
  
  
  // Loading state
  if (assessmentLoading || moduleLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }
  
  // Error state
  if (assessmentError || moduleError) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}>
        <Typography color="error">Failed to load assessment data</Typography>
      </Box>
    );
  }
  
  // Check if both data objects exist
  if (!questions || !module) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}>
        <Typography color="error">Some data is missing</Typography>
      </Box>
    );
  }
  
  // The questions are already an array based on your network response
  const title = module.title || "Assessment";
  
  return (
    <AssessmentLayout
      title={title}
      questions={questions} // Pass the questions array directly
      moduleId={moduleId as string} // Pass the moduleId to the AssessmentLayout
    />
  );
}

export default AssessmentPage;