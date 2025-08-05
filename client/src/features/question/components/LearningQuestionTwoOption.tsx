import { Box, Typography, Button, useTheme } from "@mui/material";
import React, { useState } from "react";
import OptionItem from "./OptionMicroComponent";
import { QuestionProps } from "../Types/types";

const LearningQuestionTwoOption: React.FC<QuestionProps> = ({
  id,
  questionSubText,
  questionSubHeading,
  questionText,
  optionType,
  options = [],
  onAnswer,
  explanation = "",
  sx = {},
}) => {
  const theme = useTheme();
  const [showExplanation, setShowExplanation] = useState(false);

  const handleExplanation = (selectedOption : string) => {
    if (selectedOption == "right") {
      setShowExplanation(true);
    }else{
      onAnswer && onAnswer(selectedOption,id);
    }
  }
  const handleNext = () => {
    setShowExplanation(false);
    onAnswer && onAnswer("wrong",id);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ width: "100%"}}
    >
      {!showExplanation && (
        <>
          {/* Question Content */}
          <Box bgcolor={theme.palette.primary.main}>
          <Box p={"20px 20px 12px 20px"} sx={{...sx}} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
            {questionSubText && (
              <Box mb={"12px"}>
                <Typography fontSize={"10px"} fontWeight={400} color="black">
                  {questionSubText}
                </Typography>
              </Box>
            )}

            {questionSubHeading && (
              <Box mb={"12px"}>
                <Typography variant="h5" color="black">
                  {questionSubHeading}
                </Typography>
              </Box>
            )}

            <Box
              textAlign="left"
              display={"flex"}
              alignItems={"center"}
              sx={{ marginBottom: "32px" }}
            >
              <Typography fontWeight={400} fontSize={"16px"} color="black">
                {questionText}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h3" color="black">
                Want to know more?
              </Typography>
            </Box>
          </Box>

          {/* Options */}
          <Box>
            <OptionItem
              options={options}
              type={optionType}
              onSelect={handleExplanation}
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
            bgcolor={theme.palette.primary.main}
            color={"black"}
          >
            <Box
              sx={{ fontSize: "14px" }}
              dangerouslySetInnerHTML={{ __html: explanation }}
            />
          </Box>
          <Box textAlign="center" mb={2} >
            <Button variant="contained" fullWidth onClick={handleNext}  sx={{borderRadius:"0",background:"rgba(64, 64, 64, 1)",color:"white"}}>
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default LearningQuestionTwoOption;
