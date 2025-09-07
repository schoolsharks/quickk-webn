import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import InfoCard from "../../../question/components/InfoCard";
import QuestionTwoOption from "../../../question/components/QuestionTwoOption";
import BidCard from "../../../user/components/BidCard";
import { useSubmitPulseResponseMutation } from "../../dailyPulseApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { OptionType } from "../../../question/Types/types";
import { motion } from "framer-motion";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { handleHaptic } from "../../../../utils/haptics";
import { carouselSlide } from "../../../../animation/variants/slideCarousel";
import Upcoming_Event from "../../../user/components/Upcoming_Event";

type PulseItemType = "infoCard" | "QuestionTwoOption" | "bidCard" | "eventCard";

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

interface BidCardPulseItem extends BasePulseItem {
  type: "bidCard";
}
interface EventCardPulseItem extends BasePulseItem {
  type: "eventCard";
}

export type PulseItem =
  | InfoPulseItem
  | QuestionTwoOptionPulseItem
  | BidCardPulseItem
  | EventCardPulseItem;

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
  const [_currentIndex, setCurrentIndex] = useState(0);
  const [maxHeight, setMaxHeight] = useState<number>(1);
  const sliderRef = useRef<Slider | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize cardRefs array when pulseItems change
  useEffect(() => {
    cardRefs.current = new Array(pulseItems.length).fill(null);
    setMaxHeight(0); // Reset max height when items change
  }, [pulseItems.length]);

  // Effect to calculate maximum height of all cards
  useEffect(() => {
    const calculateMaxHeight = () => {
      let maxCardHeight = 0;

      cardRefs.current.forEach((cardRef) => {
        if (cardRef) {
          // Temporarily reset height to get natural height
          const originalHeight = cardRef.style.height;
          const originalMinHeight = cardRef.style.minHeight;

          cardRef.style.height = "auto";
          cardRef.style.minHeight = "auto";

          // Get the natural height of the card
          const height = cardRef.scrollHeight;

          // Restore original styles
          cardRef.style.height = originalHeight;
          cardRef.style.minHeight = originalMinHeight;

          if (height > maxCardHeight) {
            maxCardHeight = height;
          }
        }
      });

      if (maxCardHeight > 0 && maxCardHeight !== maxHeight) {
        setMaxHeight(maxCardHeight);
      }
    };

    // Calculate heights after component mount and data changes
    const timeoutId = setTimeout(calculateMaxHeight, 150);

    // Also recalculate on window resize (debounced)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateMaxHeight, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [pulseItems, smallSize, maxHeight]);

  // Effect to apply calculated height to all cards
  useEffect(() => {
    if (maxHeight > 0) {
      cardRefs.current.forEach((cardRef) => {
        if (cardRef) {
          cardRef.style.height = `${maxHeight}px`;
          cardRef.style.minHeight = `${maxHeight}px`;
        }
      });
    }
  }, [maxHeight]);

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

  const renderPulseItem = (item: PulseItem, index: number) => {
    const cardStyle = {
      height: maxHeight > 0 ? `${maxHeight}px` : "auto",
      minHeight: maxHeight > 0 ? `${maxHeight}px` : "auto",
    };

    switch (item.type) {
      case "infoCard":
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
            <InfoCard
              id={item.id}
              title={item.title}
              content={item.content}
              response={item.response}
              wantFeedback={item.wantFeedback && !readOnly}
              onClickFeedback={readOnly ? undefined : handleAnswer}
              smallSize={smallSize}
              sx={{ height: "100%" }}
            />
          </Box>
        );
      case "QuestionTwoOption":
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
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
              sx={{ height: "100%" }}
            />
          </Box>
        );
      case "eventCard":
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
            <Upcoming_Event />
          </Box>
        );
      case "bidCard":
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
            <BidCard />
          </Box>
        );
      default:
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
            <Typography>Unknown pulse item type</Typography>
          </Box>
        );
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
          <Typography variant="h4">Daily Pulse</Typography>
          {showScore && (
            <Typography variant="h4" display={"flex"} alignItems={"center"}>
              {totalScore}
              <StarsOutlinedIcon sx={{ ml: 0.5, fontSize: "24px" }} />
            </Typography>
          )}
        </Box>
      )}

      {/* Content slider */}
      <Box
        mt={"15px"}
        height={
          maxHeight > 0
            ? `${maxHeight + 60}px` // Add extra space for dots and padding
            : smallSize
            ? "250px"
            : "420px"
        }
      >
        <Slider
          key={maxHeight}
          {...settings}
          ref={sliderRef}
        >
          {pulseItems.map((item, index) => (
            <Box px={"20px"} key={item.id} height={"100%"}>
              <motion.div
                variants={carouselSlide}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ height: "100%" }}
              >
                {renderPulseItem(item, index)}
              </motion.div>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default DailyPulseLayout;
