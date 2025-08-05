import React from "react";
import DailyPulseLayout from "../../dailyPulse/components/user/DailyPulseLayout";
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import {
  useGetDailyPulseQuery,
  // useGetTodayDailyPulseEngagementQuery,
} from "../../dailyPulse/dailyPulseApi";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

const DailyPulseDC: React.FC = () => {
  const { data, isLoading, error } = useGetDailyPulseQuery({});
  // const {
  //   data: engagementData,
  //   isLoading: engagementLoading,
  //   // error: engagementError,
  // } = useGetTodayDailyPulseEngagementQuery({});
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          Daily interaction Not Available
        </Typography>
        <Typography variant="body1">
          Looks like there's no Daily interaction for today. Please check back
          tomorrow!
        </Typography>
      </Box>
    );
  }

  // Transform the API data to match the required props structure
  const pulseItems = data?.pulseItems.map((item: any) => {
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
  return (
    <Box
      sx={{
        bgcolor: "#0D0D0D",
        p: "20px",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          flex: 1,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            // alignItems: "center",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box
            display={"flex"}
            alignItems="flex-start"
            justifyContent={"space-between"}
            flexDirection={"column"}
          >
            <Box>
              <Typography variant="h4" color="white">
                Daily Interaction
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: "#96FF43", cursor: "pointer" }}
                onClick={() => navigate("/admin/learnings/dailyInteraction")}
              >
                Manage
              </Typography>
              <ArrowForwardIcon
                sx={{
                  color: "#96FF43",
                  fontSize: 20,
                  transform: "rotate(-45deg)",
                }}
              />
            </Box>
          </Box>
          <IconButton
            sx={{
              "& .hover": {
                backgroundColor: "transparent",
              },
              "$ .MuiButtonBase-root": {
                ":& .hover": {
                  backgroundColor: "transparent",
                },
              },
              p: 0,
              color: "white",
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>

      <Box maxWidth={"350px"} px={2} mx={"auto"}>
        <DailyPulseLayout
          pulseItems={pulseItems}
          showScore={false}
          readOnly={true}
          smallSize={true}
        />
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          mt: 10,
          display: "flex",
          gap: 0,
          maxWidth: "480px",
          mx: "auto",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            py: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            border: "1px solid #96FF43",
          }}
        >
          <Typography variant="h6" fontSize={"18px"} color="white">
            {/* {engagementLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              `${engagementData?.performedCount ?? 0}%`
            )} */}
            40%
          </Typography>
          <Typography variant="h6" fontSize={"18px"} color="white">
            Attempted
          </Typography>
        </Box>
        <Box
          sx={{
            py: 2,
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            border: "1px solid white",
          }}
        >
          <Typography variant="h6" fontSize={"18px"} color="white">
            {/* {engagementLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : engagementData?.engagementRatio ? (
              `${(engagementData.engagementRatio * 100).toFixed(0)}%`
            ) : (
              "0%"
            )} */}
            60%
          </Typography>
          <Typography variant="h6" fontSize={"18px"}>
            Viewed
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DailyPulseDC;
