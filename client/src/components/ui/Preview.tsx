import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import InfoCard from "../../features/question/components/InfoCard";
import QuestionTwoOption from "../../features/question/components/QuestionTwoOption";
import { OptionType } from "../../features/question/Types/types";
import QuestionMemoryMatch from "../../features/question/components/QuestionMemoryMatch";
import QuestionDragOrder from "../../features/question/components/QuestionDragOrder";
import LearningQuestionTwoOption from "../../features/question/components/LearningQuestionTwoOption";
import QuestionMCQ from "../../features/question/components/QuestionMCQ";

export interface QuetionData {
  type: string;
  qType: string;
  questionText: string;
  title?: string;
  content?: string;
  optionA?: string;
  optionB?: string;
  correctAnswer: string | string[];
  image?: string | File | null;
  options: string[];
  wantFeedback?: boolean;
  questionSubText?: string;
  questionSubHeading?: string;
  optionType?: OptionType;
  questionOptions?: string[];
  explanation?: string;
  response?: string;
  memoryPairs?: MemoryPair[];
}

export interface MemoryPair {
  id: string;
  content: string;
  matchId: string;
  type: "text" | "image";
}

interface PreviewProps {
  quetionData: QuetionData;
  containerStyle?: React.CSSProperties;
  onFeedbackClick?: () => void;
  onAnswerSelect?: (answer: any) => void;
}

const Preview: React.FC<PreviewProps> = ({
  quetionData,
  containerStyle,
  onFeedbackClick = () => {},
  onAnswerSelect = () => {},
}) => {

  const theme=useTheme()
  const defaultData = {
    flashCard: {
      title: "Did you know?",
      content:
        "The POSH Act, 2013 is a law that protects women from sexual harassment at the workplace. It defines what counts as harassment and outlines rules for employers and employees.",
    },
    multipleChoice: {
      questionText: "What do you think about this? Give Your opinion.",
      questionOptions: ["A - Opinion A", "B - Opinion B"],
      options: ["A", "B"],
    },
    multipleImages: {
      questionText: "Choose what you think would be relevant?",
      options: [
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop",
      ],
    },
    rightWrong: {
      questionText: "Is this correct or not?",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
    },
    mcq: {
      questionText: "Which of the following is correct?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    },
    matchPair: {
      questionText: "Match the following pairs:",
      memoryPairs: [
        { id: "1", content: "Apple", matchId: "a", type: "text" },
        { id: "2", content: "Banana", matchId: "b", type: "text" },
        { id: "a", content: "Red", matchId: "1", type: "text" },
        { id: "b", content: "Yellow", matchId: "2", type: "text" },
      ],
      correctAnswer: ["1-a", "2-b"],
    },
    DRAG_ORDER: {
      questionText: "Arrange the steps in the correct order:",
      correctAnswer: ["Step 1", "Step 2", "Step 3", "Step 4"],
      options: ["Step 3", "Step 1", "Step 4", "Step 2"],
    },
    rightWrongLearning: {
      questionSubHeading: "Fact Check",
      questionSubText:
        "Read the statement below and decide if it's right or wrong.",
      questionText: "The earth revolves around the sun.",
      correctAnswer: "right",
      explanation:
        "The earth does revolve around the sun, making this statement correct.",
    },
  };

  const getPreviewComponent = () => {
    switch (quetionData?.type) {
      case "Flash Card":
        return (
          <InfoCard
            id="preview"
            title={quetionData?.title || defaultData.flashCard.title}
            content={quetionData?.content || defaultData.flashCard.content}
            wantFeedback={quetionData?.wantFeedback || false}
            onClickFeedback={onFeedbackClick}
          />
        );

      case "Option In Question":
        return (
          <QuestionTwoOption
            id="preview"
            questionText={
              quetionData?.questionText ||
              defaultData.multipleChoice.questionText
            }
            questionOptions={
              quetionData?.optionA && quetionData?.optionB
                ? [`A - ${quetionData?.optionA}`, `B - ${quetionData?.optionB}`]
                : defaultData.multipleChoice.questionOptions
            }
            optionType="text"
            options={
              quetionData?.optionA && quetionData?.optionB
                ? ["A", "B"]
                : defaultData.multipleChoice.options
            }
            onAnswer={onAnswerSelect}
          />
        );

      case "TWO_CHOICE":
        return (
          <QuestionTwoOption
            id="preview"
            questionText={
              quetionData?.questionText || defaultData.rightWrong.questionText
            }
            optionType="correct-incorrect"
            options={["right", "wrong"]}
            image={quetionData?.image}
            onAnswer={onAnswerSelect}
          />
        );

      case "Multiple Image":
        return (
          <QuestionTwoOption
            id="preview"
            questionText={
              quetionData?.questionText ||
              defaultData.multipleImages.questionText
            }
            optionType="image"
            options={
              quetionData?.options[0] && quetionData?.options[1]
                ? [quetionData?.options[0], quetionData?.options[1]]
                : defaultData.multipleImages.options
            }
            onAnswer={onAnswerSelect}
          />
        );

      case "MULTIPLE_CHOICE":
        return (
          <Box bgcolor="white" p={"40px"} border={`2px solid ${theme.palette.primary.main}`}
          boxShadow="0px 4px 19px 0px #CD7BFF4D inset">
            <QuestionMCQ
              id="preview"
              questionText={quetionData?.questionText || ""}
              optionType="mcq"
              options={
                quetionData?.options[0] &&
                quetionData?.options[1] &&
                quetionData?.options[2] &&
                quetionData?.options[3]
                  ? quetionData?.options
                  : []
              }
              explanation={quetionData?.explanation || ""}
              correctAnswer={quetionData?.correctAnswer || ""}
            />
          </Box>
        );

      case "MEMORY_MATCH":
        return (
          <Box bgcolor="black" p={"10px"}>
            <Typography color="black">Match Pair</Typography>
            <QuestionMemoryMatch
              id="preview"
              questionText={quetionData?.questionText || ""}
              memoryPairs={quetionData?.memoryPairs || []}
              correctAnswer={
                Array.isArray(quetionData?.correctAnswer)
                  ? quetionData?.correctAnswer
                  : [quetionData?.correctAnswer]
              }
              onAnswer={() => {}}
            />
          </Box>
        );

      case "DRAG_ORDER":
        return (
          <Box bgcolor="white" p={"15px"} border={`2px solid ${theme.palette.primary.main}`}
          boxShadow="0px 4px 19px 0px #CD7BFF4D inset">
            <QuestionDragOrder
              id="preview"
              questionText={quetionData?.questionText || ""}
              options={quetionData?.options || defaultData.DRAG_ORDER.options}
              questionSubHeading={quetionData?.questionSubHeading || ""}
              correctAnswer={quetionData?.correctAnswer || ""}
              onAnswer={() => {}}
              optionType="drag-order"
              explanation={quetionData?.explanation || ""}
            />
          </Box>
        );

      case "Right Wrong":
        return (
          <LearningQuestionTwoOption
            id="preview"
            questionSubHeading={quetionData?.questionSubHeading || ""}
            questionSubText={quetionData?.questionSubText || ""}
            questionText={quetionData?.questionText || ""}
            correctAnswer={quetionData?.correctAnswer || ""}
            optionType="correct-incorrect"
            options={["right", "wrong"]}
            explanation={quetionData?.explanation || ""}
          />
        );
    }
  };

  const defaultContainerStyle = {
    flex: 1,
    minHeight: "700px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: "20px 120px",
    minWidth: "350px",
  };

  return (
    <Box sx={{ ...defaultContainerStyle, ...containerStyle }}>
      {getPreviewComponent()}
    </Box>
  );
};

export default Preview;
