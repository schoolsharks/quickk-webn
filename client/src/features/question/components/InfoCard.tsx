import { Box, Typography } from "@mui/material";
import React from "react";
import GreenBox from "./GreenBox";
import WantFeedback, { FeedbackType } from "./WantFeedback";

interface InfoCardProps {
  id: string;
  title: string;
  content: string;
  wantFeedback: boolean;
  response?: string;
  onClickFeedback?: (feedback: FeedbackType, id: string) => void;
  sx?: object;
  smallSize?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  id,
  title,
  content,
  wantFeedback,
  response,
  onClickFeedback,
  sx = {},
  smallSize = false,
}) => {
  // const theme = useTheme();
  return (
    <Box
      // height={"100%"}
      bgcolor={"rgba(205, 123, 255, 0.3)"}
      p={smallSize ? "8px 12px" : "28px 12px"}
      border="1px solid rgba(160, 74, 212, 1)"
      display={"flex"}
      flexDirection={"column"}
      sx={sx}
    >
      <Box p={smallSize ? "0" : "0 18px"}>
        <Typography
          variant={smallSize ? "h4" : "h2"}
          color="black"
          gutterBottom
        >
          {title}
        </Typography>
        <Typography
          variant={smallSize ? "body2" : "body1"}
          color="black"
          mt={"18px"}
          gutterBottom
        >
          {content}
        </Typography>
      </Box>

      {/* Design Blocks  */}
      {/* {!smallSize && ( */}
      <Box mt={smallSize ? "10px" : "26px"}>
        <GreenBox />
      </Box>
      {/* )} */}

      {!smallSize && (
        <Box mt={"26px"}>
          {" "}
          {wantFeedback && onClickFeedback ? (
            <WantFeedback
              onFeedbackSelect={(feedback) => onClickFeedback(feedback, id)}
              response={response}
            />
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default InfoCard;
