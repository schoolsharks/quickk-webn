// FlashcardPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useGetModuleQuery } from "../../features/learning/service/learningApi";
import { Box, CircularProgress, Typography } from "@mui/material";
import FlashcardLayout from "../../features/learning/components/user/FlashcardLayout";

const FlashcardPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();

  const {
    data: module,
    error: moduleError,
    isLoading: moduleLoading,
  } = useGetModuleQuery(moduleId as string);

  if (moduleLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (moduleError) {
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
        <Typography color="error">Failed to load flashcard data</Typography>
      </Box>
    );
  }

  if (!module || !module.flashcards || module.flashcards.length === 0) {
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
        <Typography color="error">No flashcards available</Typography>
      </Box>
    );
  }

  return (
    <FlashcardLayout
      title={module.title || "Flashcards"}
      flashcards={module.flashcards}
      moduleId={moduleId as string}
    />
  );
};

export default FlashcardPage;
