import { Box, Typography, Button } from "@mui/material";
import React from "react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import AnimateOnClick from "../../../animation/AnimateOnClick";
import { responseSubmitted } from "../../../animation/index";
import { baseTransition } from "../../../animation/transitions/baseTransition";

export enum FeedbackType {
  GOOD = "good",
  AVERAGE = "average",
  BAD = "bad",
}

interface WantFeedbackProps {
  onFeedbackSelect: (feedback: FeedbackType) => void;
  response?: string;
}

const WantFeedback: React.FC<WantFeedbackProps> = ({
  onFeedbackSelect,
  response,
}) => {
  const renderFeedbackIcon = () => {
    switch (response) {
      case FeedbackType.GOOD:
        return (
          <EmojiEmotionsOutlinedIcon fontSize="large" sx={{ color: "black" }} />
        );
      case FeedbackType.AVERAGE:
        return (
          <SentimentSatisfiedAltOutlinedIcon
            fontSize="large"
            sx={{ color: "black" }}
          />
        );
      case FeedbackType.BAD:
        return (
          <SentimentDissatisfiedOutlinedIcon
            fontSize="large"
            sx={{ color: "black" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {response ? (
        <>
          <Typography variant="h6" color="black" gutterBottom>
            Thanks for the feedback!
          </Typography>
          <Box
            sx={{
              display: "flex",
              bgcolor: "#FFFFFFCC",
              justifyContent: "center",
              alignContent: "center",
              borderRadius: "0px",
              flex: "1",
              p: "12px 20px",
            }}
          >
            {renderFeedbackIcon()}
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h6" color="black" gutterBottom>
            Is this easy to understand?
          </Typography>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyItems={"space-between"}
            alignItems={"center"}
            gap={"20px"}
            mt={"5px"}
          >
            <AnimateOnClick
              variants={responseSubmitted}
              transition={baseTransition}
            >
              <Button
                onClick={() => onFeedbackSelect(FeedbackType.GOOD)}
                sx={{
                  display: "flex",
                  bgcolor: "#FFFFFFCC",
                  justifyContent: "center",
                  alignContent: "center",
                  borderRadius: "0px",
                  flex: "1",
                  p: "12px 20px",
                }}
              >
                <EmojiEmotionsOutlinedIcon
                  fontSize="medium"
                  sx={{ color: "black" }}
                />
              </Button>
            </AnimateOnClick>

            <AnimateOnClick
              variants={responseSubmitted}
              transition={baseTransition}
            >
              <Button
                onClick={() => onFeedbackSelect(FeedbackType.AVERAGE)}
                sx={{
                  display: "flex",
                  bgcolor: "#FFFFFFCC",
                  justifyContent: "center",
                  borderRadius: "0px",
                  alignContent: "center",
                  flex: "1",
                  p: "12px 20px",
                }}
              >
                <SentimentSatisfiedAltOutlinedIcon
                  fontSize="medium"
                  sx={{ color: "black" }}
                />
              </Button>
            </AnimateOnClick>
            <AnimateOnClick
              variants={responseSubmitted}
              transition={baseTransition}
            >
              <Button
                onClick={() => onFeedbackSelect(FeedbackType.BAD)}
                sx={{
                  display: "flex",
                  bgcolor: "#FFFFFFCC",
                  borderRadius: "0px",
                  justifyContent: "center",
                  alignContent: "center",
                  flex: "1",
                  p: "12px 20px",
                }}
              >
                <SentimentDissatisfiedOutlinedIcon
                  fontSize="medium"
                  sx={{ color: "black" }}
                />
              </Button>
            </AnimateOnClick>
          </Box>
        </>
      )}
    </Box>
  );
};

export default WantFeedback;
