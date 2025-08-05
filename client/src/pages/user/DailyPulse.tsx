import React from "react";
import DailyPulseLayout from "../../features/dailyPulse/components/user/DailyPulseLayout";
import { useGetDailyPulseQuery } from "../../features/dailyPulse/dailyPulseApi";
import { PulseItem } from "../../features/dailyPulse/components/user/DailyPulseLayout";
import { Box, CircularProgress, Typography } from "@mui/material";

const DailyPulse: React.FC = () => {
  const { data, isLoading, error } = useGetDailyPulseQuery({});

  if (isLoading) {
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
          Daily Pulse Not Available
        </Typography>
        <Typography variant="body1">
          Looks like there's no Daily Pulse for today. Please check back
          tomorrow!
        </Typography>
      </Box>
    );
  }

  // Transform the API data to match the required props structure
  const pulseItems: PulseItem[] = data?.pulseItems.map((item: any) => {
    if (item.type === "infoCard") {
      return {
        type: "infoCard",
        response: item.feedback,
        id: item.id,
        title: item.title,
        content: item.content,
        wantFeedback: item.wantFeedback,
        score: item.score,
      };
    } else {
      return {
        type: "QuestionTwoOption",
        response: item.response,
        id: item.id,
        questionText: item.questionText,
        image: item.image,
        optionType: item.optionType,
        options: item.options,
        questionOptions: item.questionOptions,
        score: item.score,
      };
    }
  });

  return <DailyPulseLayout pulseItems={pulseItems} />;
};

export default DailyPulse;
