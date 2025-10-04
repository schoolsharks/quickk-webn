import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModuleCompleteLayout from "../../features/learning/components/user/ModuleCompleteLayout";
import {
  useGetModuleCompleteQuery,
  useMarkModuleCompletedMutation,
} from "../../features/learning/service/learningApi";
import { Box, Typography } from "@mui/material";
import Loader from "../../components/ui/Loader";

const ModuleComplete: React.FC = () => {
  const navigate = useNavigate();
  const handleNextModule = () => {
    navigate(`/user/module/${data.nextModuleId}`);
  };

  const navigateToHome = () => {
    navigate("/user/dashboard");
  };

  const { currentModuleId } = useParams<{ currentModuleId: string }>();
  const { data, error, isLoading } = useGetModuleCompleteQuery(
    currentModuleId as string
  );
  const [markModuleCompleted] = useMarkModuleCompletedMutation();

  useEffect(() => {
    const markCompleted = async () => {
      if (currentModuleId) {
        try {
          markModuleCompleted({ moduleId: currentModuleId }).unwrap();
        } catch (err) {
          console.error("Error marking module as completed", err);
        }
      }
    };

    markCompleted();
  }, [currentModuleId, markModuleCompleted]);

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Typography color="error">
          Failed to load Module Complete Page.
        </Typography>
      </Box>
    );
  }
  return (
    <ModuleCompleteLayout
      points={data.totalStarsAwarded || 0}
      duration={data.duration}
      recommendations={data.resources || []}
      onNextModule={() => handleNextModule()}
      onHomeClick={() => navigateToHome()}
    />
  );
};

export default ModuleComplete;
