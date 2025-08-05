import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { AssessmentProps } from "../../Types/types";
import {
  useCheckQuestionResponseMutation,
  useSubmitLearningResponseMutation,
} from "../../service/learningApi";
import { theme } from "../../../../theme/theme";
import QuestionDragOrder from "../../../question/components/QuestionDragOrder";
import QuetionMCQ from "../../../question/components/QuetionMCQ";
import QuestionMemoryMatch from "../../../question/components/QuestionMemoryMatch";

const AssessmentLayout: React.FC<AssessmentProps> = ({
  title,
  questions = [],
  moduleId,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sliderRef = React.useRef<Slider | null>(null);
  const [submitLearningResponse] = useSubmitLearningResponseMutation();
  const [CheckQuestionResponse] = useCheckQuestionResponseMutation();
  // Add state to track current correct answer for each question
  const [currentCorrectAnswers, setCurrentCorrectAnswers] = useState<{
    [key: string]: string;
  }>({});

  const handleOptionClick = async (
    answer: string | string[],
    questionId: string
  ) => {
    const payload = {
      questionId: questionId,
      response: answer,
    };
    CheckQuestionResponse(payload)
      .unwrap()
      .then((result) => {
        setCurrentCorrectAnswers((prev) => ({
          ...prev,
          [questionId]: result?.data.correctAnswer,
        }));
      })
      .catch((error) => console.log("Error in selecting option : ", error));
  };

  useEffect(() => {
    console.log("Current Correct answer", currentCorrectAnswers);
  }, [currentCorrectAnswers]);

  const handleAnswer = async (
    answer: string | string[],
    questionId: string
  ) => {
    const payload = {
      refId: questionId,
      questionResponse: answer,
    };

    if (currentIndex === (questions?.length || 0) - 1) {
      navigate(`/user/moduleComplete/${moduleId}`);
    }

    sliderRef.current?.slickNext();
    setCurrentIndex((prev) => prev + 1);

    try {
      await submitLearningResponse(payload).unwrap();
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    swipeToSlide: false,
    arrows: false,
    draggable: false,
    touchMove: false,
  };

  // Check if questions is available and has items
  const hasQuestions = Array.isArray(questions) && questions.length > 0;
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(currentIndex);
    }
    window.scrollTo(0, 0);
  }, [currentIndex]);

  return (
    <Box pt={"32px"} bgcolor={"black"}>
      {/* Header */}
      <Box p={"0px 30px 0px 32px"}>
        <Box>
          <Typography
            variant="h5"
            fontSize={"16px"}
            color={theme.palette.primary.main}
          >
            {title || "Assessment"}
          </Typography>
        </Box>

        {/* Progress Bar - Only show if we have questions */}
        {hasQuestions && (
          <Box
            sx={{
              height: "13px",
              width: "100%",
              backgroundColor: "white",
              position: "relative",
              display: "flex",
              alignItems: "center",
              mt: 3,
            }}
          >
            <Box
              sx={{
                height: "9px",
                mx: "3px",
                width: `${(currentIndex / questions.length) * 100}%`,
                backgroundColor: "black",
                transition: "width 0.3s ease-in-out",
              }}
            />
          </Box>
        )}

        <Typography fontSize={"18px"} fontWeight={400} mt={"32px"}>
          Quiz Time!
        </Typography>
      </Box>

      {/* Content Area */}
      <Box sx={{ p: "0px 14px 0px 16px", mt: "12px" }}>
        {hasQuestions ? (
          <Box sx={{ height: "100vh" }}>
            <Slider {...settings} ref={sliderRef}>
              {questions.map((question: any, index: number) => (
                <Box key={index} px={1}>
                  {question.qType === "DRAG_ORDER" ? (
                    <QuestionDragOrder
                      questionSubHeading={question.questionSubHeading}
                      id={question._id}
                      optionType={"drag-order"}
                      questionText={question.questionText}
                      options={question.options}
                      correctAnswer={question.correctAnswer}
                      explanation={question.explanation}
                      onAnswer={handleAnswer}
                    />
                  ) : question.qType === "MULTIPLE_CHOICE" ? (
                    <QuetionMCQ
                      id={question._id}
                      questionText={question.questionText}
                      optionType={"mcq"}
                      options={question.options}
                      explanation={question.explanation}
                      correctAnswer={currentCorrectAnswers[question._id]}
                      onAnswer={handleAnswer}
                      onOptionClick={handleOptionClick}
                    />
                  ) : question.qType === "MEMORY_MATCH" ? (
                    <QuestionMemoryMatch
                      id={question._id}
                      questionText={question.questionText}
                      memoryPairs={question.memoryPairs}
                      correctAnswer={question.correctAnswer}
                      onAnswer={handleAnswer}
                    />
                  ) : null}
                </Box>
              ))}
            </Slider>
          </Box>
        ) : (
          <Box
            sx={{
              minHeight: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">No questions available</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AssessmentLayout;
