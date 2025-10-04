// FlashcardLayout.tsx
import React, { useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FlashcardProps } from "../../Types/types";
import BottomNavigation from "../../../../components/ui/BottomNavigation";
import GlossaryQuestion from "../../../question/components/GlossaryQuestion";
import { ArrowOutward } from "@mui/icons-material";

// Custom styles for the slider
const sliderStyles = `
  .slick-dots {
    bottom: -50px !important;
    z-index: 10 !important;
  }
  .slick-dots li {
    margin: 0 !important;
  }
  .slick-dots li button:before {
    font-size: 12px !important;
    opacity: 0.5 !important;
  }
  .slick-dots li.slick-active button:before {
    opacity: 1 !important;
    color: primary.main !important;
  }
`;

const FlashcardLayout: React.FC<FlashcardProps> = ({
  // title,
  flashcards = [],
  moduleId,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sliderRef = React.useRef<Slider | null>(null);

  // Transform flashcards into slides (grouped main slides + individual explanation slides)
  const slides = React.useMemo(() => {
    // Phase 1: Create main flashcard slides (2 questions per slide, except last if odd)
    const mainSlides: any[] = [];
    for (let i = 0; i < flashcards.length; i += 2) {
      const firstQuestion = { ...flashcards[i], questionNumber: i + 1 };
      const secondQuestion = flashcards[i + 1]
        ? { ...flashcards[i + 1], questionNumber: i + 2 }
        : null;

      mainSlides.push({
        slideType: "main",
        questions: secondQuestion
          ? [firstQuestion, secondQuestion]
          : [firstQuestion],
        flashcardNumber: Math.floor(i / 2) + 1,
      });
    }

    // Phase 2: Create explanation slides (only for questions that have explanations)
    const explanationSlides: any[] = [];
    let explanationCounter = 1;

    flashcards.forEach((flashcard, index) => {
      if (flashcard.explanation && flashcard.explanation.trim()) {
        explanationSlides.push({
          ...flashcard,
          slideType: "explanation",
          explanationNumber: explanationCounter,
          originalQuestionNumber: index + 1,
        });
        explanationCounter++;
      }
    });

    // Combine: all main slides first, then all explanation slides
    return [...mainSlides, ...explanationSlides];
  }, [flashcards]);

  const handleAnswer = () => {
    navigate(`/user/moduleComplete/${moduleId}`);
  };

  const currentSlide = slides[currentIndex];
  const isExplanationSlide = currentSlide?.slideType === "explanation";

  useEffect(() => {
    window.scrollTo(0, 0);

    // Inject custom styles for slider
    const styleElement = document.createElement("style");
    styleElement.textContent = sliderStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true, // Center the current slide
    centerPadding: "100px", // Increase padding to show more of adjacent slides
    swipe: true,
    swipeToSlide: true,
    arrows: false,
    beforeChange: (_: number, next: number) => {
      setCurrentIndex(next);
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "30px",
        },
      },
    ],
    appendDots: (dots: React.ReactNode) => (
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          transform: "translateY(25px)",
          zIndex: 10,
          position: "relative",
        }}
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

  return (
    <Box
      pt={"28px"}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height={"100vh"}
    >
      {/* Header */}
      <Box width={"100%"} px={"45px"}>
        <Typography
          variant="h5"
          fontSize={"1.25rem"}
          fontWeight={"400"}
          textAlign={"left"}
          color={isExplanationSlide ? "primary.main" : "#ffffff"}
        >
          {isExplanationSlide ? "Quickk Bites." : "What did you learn?"}
        </Typography>
      </Box>

      {/* Content Area */}
      <Box sx={{ px: "10px", pb: 15, mt: "30px" }}>
        <Box sx={{ height: 320, mb: 4, overflow: "visible" }}>
          <Slider {...settings} ref={sliderRef}>
            {slides?.map((slide: any, index: number) => {
              const isCurrentSlide = index === currentIndex;
              const isLastSlide = index === slides.length - 1;
              return (
                <Box key={`${slide.slideType}-${index}`}>
                  <Box
                    sx={{
                      transform: isCurrentSlide ? "scale(1)" : "scale(0.9)",
                      opacity: isCurrentSlide || isLastSlide ? 1 : 0.5,
                      transition: "all 0.3s ease-in-out",
                      mx: 1,
                      position: "relative",
                      zIndex: isCurrentSlide ? 2 : 1,
                    }}
                  >
                    <GlossaryQuestion
                      id={
                        slide.slideType === "main"
                          ? "main-slide"
                          : slide._id || "explanation-slide"
                      }
                      questionText={
                        slide.slideType === "main"
                          ? ""
                          : slide.questionText || ""
                      }
                      optionType={slide.optionType || "text"}
                      slideType={slide.slideType}
                      questions={slide.questions}
                      explanation={slide.explanation}
                      explanationNumber={slide.explanationNumber}
                      isLastSlide={index === slides.length - 1}
                      onAnswer={handleAnswer}
                      sx={{
                        minHeight: "350px",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Slider>
        </Box>
      </Box>

      {/* Bottom Navigation */}
      {currentIndex >= slides.length - 1 && (
        <Button
          endIcon={<ArrowOutward />}
          onClick={() => handleAnswer()}
          sx={{
            background: theme.palette.primary.main,
            color: "black",
            borderRadius: "0",
            width: "100%",
            p: "20px",
          }}
        >
          <Typography variant="h5">Next</Typography>
        </Button>
      )}
      <BottomNavigation />
    </Box>
  );
};

export default FlashcardLayout;
