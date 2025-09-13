import { Box, Typography, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import OptionItem from "./OptionMicroComponent";
import OptionResultsComponent from "./OptionResultsComponent";
import { QuestionProps } from "../Types/types";

const QuestionTwoOption: React.FC<QuestionProps> = ({
  id,
  questionText,
  image,
  optionType,
  questionOptions = [],
  options = [],
  response,
  pulseStats,
  onAnswer,
  sx = {},
  smallSize = false,
}) => {
  const theme = useTheme();
  const [showResults, setShowResults] = useState(false);
  const [userResponse, setUserResponse] = useState<string | undefined>(
    response
  );

  // Update userResponse when response prop changes
  useEffect(() => {
    setUserResponse(response);
    // Show results if user has responded to supported question types
    setShowResults(
      !!response &&
        (optionType === "text" || optionType === "correct-incorrect")
    );
  }, [response, optionType]);

  const handleOptionSelect = (selectedOption: string) => {
    if (onAnswer) {
      setUserResponse(selectedOption);
      // Show results immediately for supported option types
      if (optionType === "text" || optionType === "correct-incorrect") {
        setShowResults(true);
      }
      onAnswer(selectedOption, id);
    }
  };

  const shouldShowResults =
    showResults &&
    userResponse &&
    (optionType === "text" || optionType === "correct-incorrect");

  return (
    <Box
      border={`2px solid ${theme.palette.primary.main}`}
      boxShadow="0px 4px 19px 0px #CD7BFF4D inset"
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
    >
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        // justifyContent={"space-between"}
        sx={{
          ...sx,
        }}
        // bgcolor={"#464646"}
      >
        {/* Question text section */}
        <Box
          textAlign="left"
          display={"flex"}
          alignItems={"center"}
          p={smallSize ? "14px" : "24px 16px"}
        >
          <Typography
            variant={smallSize ? "h5" : "h2"}
            // color="white"
            fontWeight="medium"
          >
            {questionText}
          </Typography>
        </Box>

        {questionOptions && !!questionOptions.length && (
          <Box py={smallSize ? "20px" : "10px"}>
            {questionOptions.map((option, index) => (
              <Box key={index} p={smallSize ? "0px 20px" : "10px 20px"}>
                <Typography variant="h5" color="black" gutterBottom>
                  {option}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Question image section */}
        {image && (
          <Box
            component="img"
            src={
              typeof image === "string"
                ? image
                : image instanceof File
                ? URL.createObjectURL(image)
                : undefined
            }
            alt="Question Image"
            sx={{
              width: "100%",
              height: smallSize ? "130px" : "280px",
              maxHeight: "280px",
              objectFit: "cover",
            }}
          />
        )}
      </Box>
      {/* Options section */}
      <Box>
        {shouldShowResults ? (
          <OptionResultsComponent
            options={options}
            type={optionType}
            selectedOption={userResponse!}
            pulseStats={pulseStats}
            smallSize={smallSize}
          />
        ) : (
          <OptionItem
            selectedOption={response}
            options={options}
            type={optionType}
            onSelect={handleOptionSelect}
            smallSize={smallSize}
          />
        )}
      </Box>
    </Box>
  );
};

export default QuestionTwoOption;
