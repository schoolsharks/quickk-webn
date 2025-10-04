import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import VideoModuleLayout from "./VideoModuleLayout";
import { ModuleProps } from "../../Types/types";
import LearningQuestionTwoOption from "../../../question/components/LearningQuestionTwoOption";
import BottomNavigation from "../../../../components/ui/BottomNavigation";
import AudioModuleLayout from "./AudioModuleLayout";

const ModuleLayout: React.FC<ModuleProps> = ({
  moduleId,
  isVideoWatched,
  content,
  type,
  title,
}) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sliderRef = React.useRef<Slider | null>(null);

  const handleAnswer = (selectedOption: string | string[], _: string) => {
    if (currentIndex === questions.length - 1) {
      navigate(`/user/practice/${moduleId}`);
    }
    if (selectedOption === "wrong") {
      sliderRef.current?.slickNext();
      setCurrentIndex((prev) => prev + 1);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const questions = type === "question" ? (content as string[]) : [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <Box
        display="flex"
        justifyContent="center"
        sx={{ transform: "translateY(15px)" }}
      >
        {dots}
      </Box>
    ),
    customPaging: () => (
      <Box
        sx={{
          width: 10,
          height: 10,
          transition: "all 0.3s",
        }}
      />
    ),
  };
  //question: flashcard - quiz - reward
  //video: video - quiz - flashcard - reward

  if (type === "video") {
    return (
      <VideoModuleLayout
        url={content as string}
        moduleId={moduleId as string}
        isVideoWatched={isVideoWatched ?? false}
      />
    );
  } else if (type === "audio") {
    return (
      <AudioModuleLayout
        moduleId={moduleId as string}
        isVideoWatched={isVideoWatched ?? false}
      />
    );
  } else if (type === "question") {
    return (
      <Box pt={"76px"}>
        {/* Header */}
        <Box width={"max-content"} px={"28px"}>
          <Typography variant="h5" fontWeight={"400"}>
            Posh
          </Typography>
          <Typography variant="h5" fontWeight={"400"} textAlign={"center"}>
            {title}
          </Typography>
        </Box>

        {/* Content Area */}
        <Box sx={{ px: "20px", pb: 10, mt: "30px" }}>
          <Box sx={{ height: 400, mb: 3 }}>
            <Slider {...settings} ref={sliderRef}>
              {questions?.map((question: any, index: number) => (
                <Box key={index} px={1}>
                  <LearningQuestionTwoOption
                    id={question._id}
                    questionSubText={question.questionSubText}
                    questionSubHeading={question.questionSubHeading}
                    questionText={question.questionText}
                    image={question.image}
                    optionType={question.optionType}
                    questionOptions={question.questionOptions}
                    explanation={question.explanation}
                    options={question.options}
                    onAnswer={handleAnswer}
                    sx={{
                      minHeight: "350px",
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </Box>
    );
  }
};

export default ModuleLayout;
