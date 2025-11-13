import React from "react";
import DailyPulseLayout from "../../features/dailyPulse/components/user/DailyPulseLayout";
import { PulseItem } from "../../features/dailyPulse/components/user/DailyPulseLayout";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useCombinedDailyPulse } from "../../hooks/useCombinedDailyPulse";

const DailyPulse: React.FC = () => {
  const {
    pulseItems: combinedPulseItems,
    isLoading,
    error,
    // hasConnectionFeedback,
  } = useCombinedDailyPulse();

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
          bgcolor: "#F0D7FF",
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

  // Transform the combined pulse items to match the DailyPulseLayout expected format
  const transformedPulseItems: PulseItem[] = combinedPulseItems.map(
    (item: any) => {
      if (item.type === "connectionFeedback") {
        return {
          type: "connectionFeedback" as const,
          id: item.id,
          score: item.score,
          response: item.response,
          connectionUserId: item.connectionUserId,
          connectionUserName: item.connectionUserName,
          questionText: item.questionText,
          options: item.options,
          createdAt: item.createdAt,
          expiresAt: item.expiresAt,
        };
      } else if (item.type === "resourceRating") {
        return {
          type: "resourceRating" as const,
          id: item.id,
          score: item.score,
          response: item.response,
          resourceId: item.resourceId,
          resourceName: item.resourceName,
          companyName: item.companyName,
          claimedAt: item.claimedAt,
          expiresAt: item.expiresAt,
        };
      } else if (item.type === "infoCard") {
        return {
          type: "infoCard" as const,
          id: item.id,
          score: item.score,
          response: item.feedback,
          title: item.title,
          content: item.content,
          wantFeedback: item.wantFeedback,
        };
      } else {
        // QuestionTwoOption or other types
        return {
          type: "QuestionTwoOption" as const,
          id: item.id,
          score: item.score,
          response: item.response,
          questionText: item.questionText,
          image: item.image,
          optionType: item.optionType,
          options: item.options,
          questionOptions: item.questionOptions,
          pulseStats: item.pulseStats,
        };
      }
    }
  );

  // Add additional items if needed (uncomment if you want them)
  // const bidCardItem: PulseItem = {
  //   type: "bidCard",
  //   id: "bid-card",
  //   score: 10,
  // };
  // const eventCardItem: PulseItem = {
  //   type: "eventCard",
  //   id: "event-card",
  //   score: 10,
  // };
  // transformedPulseItems.push(eventCardItem, bidCardItem);

  return <DailyPulseLayout pulseItems={transformedPulseItems} />;
};

export default DailyPulse;
