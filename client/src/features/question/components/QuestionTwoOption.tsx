import { Box, Typography } from "@mui/material";
import React from "react";
import OptionItem from "./OptionMicroComponent";
import { QuestionProps } from "../Types/types";

const QuestionTwoOption: React.FC<QuestionProps> = ({
  id,
  questionText,
  image,
  optionType,
  questionOptions = [],
  options = [],
  response,
  onAnswer,
  sx = {},
  smallSize = false,
}) => {
  // const theme = useTheme();

  const handleOptionSelect = (selectedOption: string) => {
    if (onAnswer) {
      onAnswer(selectedOption, id);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        sx={{
          ...sx,
        }}
        bgcolor={"#464646"}
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
            color="white"
            fontWeight="medium"
          >
            {questionText}
          </Typography>
        </Box>

        {questionOptions && !!questionOptions.length && (
          <Box py={smallSize ? "20px" : "60px"}>
            {questionOptions.map((option, index) => (
              <Box key={index} p={smallSize ? "0px 20px" : "10px 20px"}>
                <Typography variant="h5" color="white" gutterBottom>
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
        <OptionItem
          selectedOption={response}
          options={options}
          type={optionType}
          onSelect={handleOptionSelect}
          smallSize={smallSize}
        />
      </Box>
    </Box>
  );
};

export default QuestionTwoOption;
