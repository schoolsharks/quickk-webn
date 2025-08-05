import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { QuestionProps } from "../Types/types";
import OptionItem from "./OptionMicroComponent";
import GlobalButton from "../../../components/ui/button";

const QuetionMCQ: React.FC<QuestionProps> = ({
  id,
  questionText,
  options = [],
  optionType = "mcq",
  explanation,
  correctAnswer,
  onAnswer,
  onOptionClick,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [explanationPage, setExplanationPage] = useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (onOptionClick) onOptionClick(option, id);
  };

  const handleNext = () => {
    if (onAnswer && selectedOption) {
      onAnswer(selectedOption, id);
    }
  };

  const handleExplanation = () => {
    setExplanationPage(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };


  return (
    <Box
      sx={{
        background: "black",
        minHeight: "400px",
        minWidth: "300px",
        p: "1",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
          borderTop: "1px solid rgba(255, 255, 255, 0.3)",
          p: "16px",
        }}
      >
        <Typography variant="h5">{questionText}</Typography>
      </Box>

      <Box mt={"36px"} mx={"auto"}>
        <OptionItem
          options={options}
          type={optionType}
          selectedOption={selectedOption}
          onSelect={handleOptionSelect}
          disabled={explanationPage}
          correctAnswer={
            Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer
          }
        />
      </Box>

      {explanationPage ? (
        <>
          <Box mt={4} bgcolor={"white"} p={"18px"} color={"black"}>
            <Typography variant="h5">
              {selectedOption ===
              (Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer)
                ? "✅ Correct answer"
                : "❌ Incorrect answer"}
            </Typography>
            <Typography variant="subtitle2" mt={1}>
              Correct option:{" "}
              {(() => {
                const correct = Array.isArray(correctAnswer)
                  ? correctAnswer[0]
                  : correctAnswer;
                const idx = options.findIndex((opt) => opt === correct);
                const optionLabels = ["A", "B", "C", "D"];
                return idx !== -1
                  ? `${optionLabels[idx] || `Option ${idx + 1}`}`
                  : "Unknown";
              })()}
            </Typography>
            <Typography mt={"10px"}>{explanation}</Typography>
          </Box>
          <Box mt={4}>
            <GlobalButton
              onClick={handleNext}
              sx={{
                background: "rgba(64, 64, 64, 1)",
                color: "white",
              }}
            >
              Next
            </GlobalButton>
          </Box>
        </>
      ) : selectedOption ? (
        <Box mt={4}>
          <GlobalButton
            onClick={handleExplanation}
            sx={{
              background: "rgba(64, 64, 64, 1)",
              color: "white",
            }}
          >
            See response
          </GlobalButton>
        </Box>
      ) : null}
    </Box>
  );
};

export default QuetionMCQ;
