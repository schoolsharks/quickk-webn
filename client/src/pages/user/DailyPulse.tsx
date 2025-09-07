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
  // Separate infoCards and other items
  const infoCards =
    data?.pulseItems
      .filter((item: any) => item.type === "infoCard")
      .map((item: any) => ({
        type: "infoCard",
        response: item.feedback,
        id: item.id,
        title: item.title,
        content: item.content,
        wantFeedback: item.wantFeedback,
        score: item.score,
      })) || [];

  const otherItems =
    data?.pulseItems
      .filter((item: any) => item.type !== "infoCard")
      .map((item: any) => ({
        type: "QuestionTwoOption",
        response: item.response,
        id: item.id,
        questionText: item.questionText,
        image: item.image,
        optionType: item.optionType,
        options: item.options,
        questionOptions: item.questionOptions,
        score: item.score,
      })) || [];

  // Add BidCard as the first item in the pulse
  const bidCardItem = {
    type: "bidCard" as const,
    id: "bid-card",
    score: 10,
  };
  const eventCardItem = {
    type: "eventCard" as const,
    id: "event-card",
    score: 10,
  };

  const pulseItems: PulseItem[] = [
    ...infoCards,
    ...otherItems,
    eventCardItem,
    bidCardItem,
  ];

  return <DailyPulseLayout pulseItems={pulseItems} />;
};

export default DailyPulse;
