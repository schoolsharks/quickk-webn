import { Box, Typography, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import OptionItem from "./OptionMicroComponent";
import { QuestionProps } from "../Types/types";

const TrueFalseQuestion: React.FC<QuestionProps> = ({
  id,
  questionText,
  optionType,
  options = [],
  onAnswer,
  explanation = "",
  sx = {},
}) => {
  const theme = useTheme();
  const [showExplanation, setShowExplanation] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    if (explanation && explanation.trim() !== "") {
      setShowExplanation(true);
    } else {
      if (onAnswer) {
        onAnswer(option, id);
      }
      setSelectedOption(null);
    }
  };

  const handleNext = () => {
    if (selectedOption && onAnswer) {
      onAnswer(selectedOption, id);
    }
    // setShowExplanation(false);
    setSelectedOption(null);
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ width: "100%" }}>
      {!showExplanation && (
        <>
          {/* Question Content */}
          <Box
            border={`2px solid ${theme.palette.primary.main}`}
            boxShadow="0px 4px 19px 0px #CD7BFF4D inset"
            bgcolor={"white"}
          >
            <Box
              p={"20px 20px 12px 20px"}
              sx={{ ...sx }}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              <Box textAlign="center" display={"flex"} alignItems={"center"}>
                <Typography fontWeight={600} fontSize={"24px"} color="black">
                  {questionText}
                </Typography>
              </Box>
            </Box>

            {/* Options */}
            <Box>
              <OptionItem
                options={options}
                type={optionType}
                onSelect={handleAnswer}
              />
            </Box>
          </Box>
        </>
      )}

      {/* Explanation */}
      {showExplanation && (
        <>
          <Box
            mt={4}
            p={2}
            border={`2px solid ${theme.palette.primary.main}`}
            boxShadow="0px 4px 19px 0px #CD7BFF4D inset"  
            color={"black"}
            minHeight={"250px"}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Box
              sx={{ fontSize: "20px" }}
              dangerouslySetInnerHTML={{ __html: explanation }}
            />
          </Box>
          <Box textAlign="center" mb={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleNext}
              sx={{
                borderRadius: "0",
                background: "rgba(64, 64, 64, 1)",
                color: "white",
                py: "16px",
              }}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TrueFalseQuestion;
