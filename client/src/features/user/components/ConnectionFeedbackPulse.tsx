import React, { useState } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { handleHaptic } from "../../../utils/haptics";

interface ConnectionFeedbackPulseProps {
  id: string;
  connectionUserId: string;
  connectionUserName: string;
  questionText: string;
  options: string[];
  score: number;
  createdAt: string;
  expiresAt: string;
  onAnswer?: (feedbackId: string, response: string) => void;
  readOnly?: boolean;
  response?: string;
  smallSize?: boolean;
}

const ConnectionFeedbackPulse: React.FC<ConnectionFeedbackPulseProps> = ({
  id,
  connectionUserName,
  questionText,
  onAnswer,
  readOnly = false,
  response,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    response || null
  );
  const theme = useTheme();

  const handleOptionClick = (option: string) => {
    if (readOnly || selectedOption) return;

    handleHaptic();
    setSelectedOption(option);

    const responseValue = option.toLowerCase() === "yes" ? "yes" : "no";
    onAnswer?.(responseValue, id);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        border: `2px solid ${theme.palette.primary.main}`,
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        boxShadow: "0px 4px 19px 0px #CD7BFF4D inset",
      }}
    >
      {/* Question Section */}
      <Box
        sx={{
          p: 2,
          textAlign: "left",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography
          sx={{
            fontSize: "30px",
            fontWeight: 600,
            color: "#000000",
            mb: 0,
            lineHeight: "35px",
          }}
        >
          {questionText.replace("[Member Name]", connectionUserName)}
        </Typography>
      </Box>

      {/* Options Section */}
      <Box
        sx={{
          display: "flex",
          height: "80px",
          borderTop: `1px solid ${theme.palette.primary.main}`,
        }}
      >
        {/* Yes Button */}
        <Button
          onClick={() => handleOptionClick("Yes")}
          disabled={readOnly || !!selectedOption}
          sx={{
            flex: 1,
            height: "100%",
            backgroundColor: "#464646",
            color: "white",
            fontSize: "30px",
            fontWeight: 600,
            borderRadius: 0,
            border: "none",
            borderRight: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          Yes
        </Button>

        {/* No Button */}
        <Button
          onClick={() => handleOptionClick("No")}
          disabled={readOnly || !!selectedOption}
          sx={{
            flex: 1,
            height: "100%",
            backgroundColor: "#D9D9D9",
            color: "black",
            fontSize: "30px",
            fontWeight: 600,
            borderRadius: 0,
            border: "none",
          }}
        >
          No
        </Button>
      </Box>
    </Box>
  );
};

export default ConnectionFeedbackPulse;
