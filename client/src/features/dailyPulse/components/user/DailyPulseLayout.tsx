import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import InfoCard from "../../../question/components/InfoCard";
import QuestionTwoOption from "../../../question/components/QuestionTwoOption";
import { useSubmitPulseResponseMutation } from "../../dailyPulseApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { OptionType } from "../../../question/Types/types";
import { motion } from "framer-motion";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { handleHaptic } from "../../../../utils/haptics";
import { carouselSlide } from "../../../../animation/variants/slideCarousel";

type PulseItemType = "infoCard" | "QuestionTwoOption";

interface BasePulseItem {
  type: PulseItemType;
  id: string;
  response?: string;
  score: number;
}

interface InfoPulseItem extends BasePulseItem {
  type: "infoCard";
  title: string;
  content: string;
  wantFeedback: boolean;
}

interface QuestionTwoOptionPulseItem extends BasePulseItem {
  type: "QuestionTwoOption";
  questionText: string;
  image?: string;
  optionType: OptionType;
  options: string[];
  questionOptions?: string[];
}

export type PulseItem = InfoPulseItem | QuestionTwoOptionPulseItem;

interface DailyPulseProps {
  pulseItems: PulseItem[];
  onAnswer?: (itemId: string, answer: any) => void;
  readOnly?: boolean;
  showScore?: boolean;
  smallSize?: boolean;
}

const DailyPulseLayout: React.FC<DailyPulseProps> = ({
  pulseItems,
  readOnly = false,
  showScore = true,
  smallSize = false,
}) => {
  const [submitPulseResponse] = useSubmitPulseResponseMutation();

  const [_currentIndex, setCurrentIndex] = React.useState(0);
  const sliderRef = React.useRef<Slider | null>(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 1500,
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
          bgcolor: "#FFFFFF",
          transition: "all 0.4s",
        }}
      />
    ),
  };

  const handleAnswer = async (answer: any, itemId: string) => {
    // Skip answer handling in read-only mode
    if (readOnly) return;

    const pulseItem = pulseItems.find((item) => item.id === itemId);
    if (!pulseItem) return console.error("Daily pulse error.");
    handleHaptic();

    const payload = {
      refId: itemId,
      type: pulseItem.type,
      feedback: pulseItem.type === "infoCard" ? answer : undefined,
      questionResponse:
        pulseItem.type === "QuestionTwoOption" ? answer : undefined,
    };

    setTimeout(() => {
      sliderRef.current?.slickNext();
      setCurrentIndex((prev) => prev + 1);
    }, 700);

    try {
      await submitPulseResponse(payload).unwrap();
      console.log("Response submitted successfully");
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  const totalScore = pulseItems.reduce(
    (total, item) => total + (item.score || 0),
    0
  );

  const renderPulseItem = (item: PulseItem) => {
    switch (item.type) {
      case "infoCard":
        return (
          <InfoCard
            id={item.id}
            title={item.title}
            content={item.content}
            response={item.response}
            wantFeedback={item.wantFeedback && !readOnly}
            onClickFeedback={readOnly ? undefined : handleAnswer}
            smallSize={smallSize}
          />
        );
      case "QuestionTwoOption":
        return (
          <QuestionTwoOption
            id={item.id}
            questionText={item.questionText}
            image={item.image}
            optionType={item.optionType}
            options={item.options}
            questionOptions={item.questionOptions}
            response={item.response}
            onAnswer={readOnly ? undefined : handleAnswer}
            smallSize={smallSize}
          />
        );
      default:
        return <Typography>Unknown pulse item type</Typography>;
    }
  };

  return (
    <Box width="100%">
      {/* Header */}

      {!smallSize && (
        <Box
          display="flex"
          px={"20px"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" color="white">
            Daily Interaction
          </Typography>
          {showScore && (
            <Typography
              variant="h4"
              color="white"
              display={"flex"}
              alignItems={"center"}
            >
              {totalScore}
              <StarsOutlinedIcon sx={{ ml: 0.5, fontSize: "16px" }} />
            </Typography>
          )}
        </Box>
      )}

      {/* Content slider */}
      <Box mt={"15px"} height={smallSize ? "250px" : "420px"}>
        <Slider {...settings} ref={sliderRef}>
          {pulseItems.map((item) => (
            <Box px={"20px"} key={item.id} height={"100%"}>
              <motion.div
                variants={carouselSlide}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {renderPulseItem(item)}
              </motion.div>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default DailyPulseLayout;
