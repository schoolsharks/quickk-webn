import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import InfoCard from "../../../question/components/InfoCard";
import QuestionTwoOption from "../../../question/components/QuestionTwoOption";
import Advertisement from "../../../question/components/Advertisement";
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
import StarsEarnedPopup from "../../../../components/ui/StarsEarnedPopup";
import ConnectionFeedbackPulse from "../../../user/components/ConnectionFeedbackPulse";
import ResourceRatingPulse from "../../../question/components/ResourceRatingPulse";
import {
  useSubmitConnectionFeedbackResponseMutation,
  useSubmitResourceRatingResponseMutation,
} from "../../dailyPulseApi";

type PulseItemType =
  | "infoCard"
  | "QuestionTwoOption"
  | "bidCard"
  | "eventCard"
  | "connectionFeedback"
  | "resourceRating";

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
  pulseStats?: {
    pulseItemId: string;
    optionType: string;
    totalResponses: number;
    results: Array<{
      option: string;
      count: number;
      percentage: number;
    }>;
  };
}

interface BidCardPulseItem extends BasePulseItem {
  type: "bidCard";
}
interface EventCardPulseItem extends BasePulseItem {
  type: "eventCard";
}

interface ConnectionFeedbackPulseItem extends BasePulseItem {
  type: "connectionFeedback";
  connectionUserId: string;
  connectionUserName: string;
  questionText: string;
  options: string[];
  createdAt: string;
  expiresAt: string;
}

interface ResourceRatingPulseItem extends BasePulseItem {
  type: "resourceRating";
  resourceId: string;
  resourceName: string;
  companyName: string;
  claimedAt: string;
  expiresAt: string;
}

export type PulseItem =
  | InfoPulseItem
  | QuestionTwoOptionPulseItem
  | BidCardPulseItem
  | EventCardPulseItem
  | ConnectionFeedbackPulseItem
  | ResourceRatingPulseItem;

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
  const [submitConnectionFeedbackResponse] =
    useSubmitConnectionFeedbackResponseMutation();
  const [submitResourceRatingResponse] =
    useSubmitResourceRatingResponseMutation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [showStarsPopup, setShowStarsPopup] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [localPulseItems, setLocalPulseItems] = useState<PulseItem[]>([]);

  useEffect(() => {
    setLocalPulseItems(pulseItems);
  }, [pulseItems]);

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
  }, [localPulseItems, smallSize]);

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
    afterChange: (current: number) => {
      setCurrentIndex(current);
    },
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

    const pulseItem = localPulseItems.find((item) => item.id === itemId);
    if (!pulseItem) return console.error("Daily pulse error.");
    handleHaptic();

    // Show stars earned popup
    setEarnedStars(pulseItem.score || 0);
    setShowStarsPopup(true);

    // Handle connection feedback separately
    if (pulseItem.type === "connectionFeedback") {
      try {
        await submitConnectionFeedbackResponse({
          feedbackId: itemId,
          response: answer,
        }).unwrap();

        // Update local state to show response
        setLocalPulseItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, response: answer } : item
          )
        );
      } catch (error) {
        console.error("Failed to submit connection feedback:", error);
      }
      return;
    }

    // Handle resource rating separately
    if (pulseItem.type === "resourceRating") {
      try {
        await submitResourceRatingResponse({
          ratingId: itemId,
          rating: answer,
        }).unwrap();

        // Update local state to show response
        setLocalPulseItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, response: answer } : item
          )
        );
      } catch (error) {
        console.error("Failed to submit resource rating:", error);
      }
      return;
    }

    const payload = {
      refId: itemId,
      type: pulseItem.type,
      feedback: pulseItem.type === "infoCard" ? answer : undefined,
      questionResponse:
        pulseItem.type === "QuestionTwoOption" ? answer : undefined,
    };

    // setTimeout(
    //   () => {
    //     sliderRef.current?.slickNext();
    //     setCurrentIndex((prev) => prev + 1);
    //   },
    //   pulseItem.type === "QuestionTwoOption" &&
    //     (pulseItem.optionType === "text" ||
    //       pulseItem.optionType === "correct-incorrect")
    //     ? 2000
    //     : 700
    // );

    try {
      const response = await submitPulseResponse(payload).unwrap();

      // If we got pulse stats back, log it for now
      if (response.pulseStats && pulseItem.type === "QuestionTwoOption") {
        console.log("Received pulse stats:", response.pulseStats);
        setLocalPulseItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  pulseStats: response.pulseStats,
                  response: response.data?.response,
                }
              : item
          )
        );

        // The QuestionTwoOption component will handle showing results using its local state
      }
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  // const totalScore = localPulseItems.reduce(
  //   (total, item) => total + (item.score || 0),
  //   0
  // );

  const handleCloseStarsPopup = () => {
    setShowStarsPopup(false);
  };

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
        // Detect Advertisement shape: optionType text + single option Interested
        const isAdvertisement =
          item.optionType === "text" &&
          Array.isArray(item.options) &&
          item.options.length === 1 &&
          (item.options[0] || "").toLowerCase() === "interested";
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
            {isAdvertisement ? (
              <Advertisement
                id={item.id}
                questionText={item.questionText}
                image={item.image}
                optionType="text"
                response={item.response}
                pulseStats={item.pulseStats}
                onAnswer={readOnly ? undefined : handleAnswer}
                smallSize={smallSize}
                sx={{ height: "100%" }}
              />
            ) : (
              <QuestionTwoOption
                id={item.id}
                questionText={item.questionText}
                image={item.image}
                optionType={item.optionType}
                options={item.options}
                questionOptions={item.questionOptions}
                response={item.response}
                pulseStats={item.pulseStats}
                onAnswer={readOnly ? undefined : handleAnswer}
                smallSize={smallSize}
                sx={{ height: "100%" }}
              />
            )}
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
      case "connectionFeedback":
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
            <ConnectionFeedbackPulse
              id={item.id}
              connectionUserId={(item as any).connectionUserId}
              connectionUserName={(item as any).connectionUserName}
              questionText={(item as any).questionText}
              options={(item as any).options}
              score={item.score}
              createdAt={(item as any).createdAt}
              expiresAt={(item as any).expiresAt}
              onAnswer={readOnly ? undefined : handleAnswer}
              response={item.response}
              smallSize={smallSize}
            />
          </Box>
        );
      case "resourceRating":
        return (
          <Box
            ref={(el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            }}
            sx={cardStyle}
          >
            <ResourceRatingPulse
              id={item.id}
              resourceId={(item as any).resourceId}
              resourceName={(item as any).resourceName}
              companyName={(item as any).companyName}
              score={item.score}
              claimedAt={(item as any).claimedAt}
              expiresAt={(item as any).expiresAt}
              onAnswer={
                readOnly
                  ? undefined
                  : (itemId: string, rating: number) =>
                      handleAnswer(rating, itemId)
              }
              response={
                typeof item.response === "string"
                  ? parseInt(item.response)
                  : item.response
              }
              smallSize={smallSize}
            />
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
          <Typography variant="h4">What’s up today?</Typography>
          {showScore && (
            <Typography variant="h4" display={"flex"} alignItems={"center"}>
              {localPulseItems[currentIndex]?.score}
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
        <Slider key={maxHeight} {...settings} ref={sliderRef}>
          {localPulseItems.map((item, index) => (
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

      {/* Stars Earned Popup */}
      <StarsEarnedPopup
        open={showStarsPopup}
        stars={earnedStars}
        onClose={handleCloseStarsPopup}
      />
    </Box>
  );
};

export default DailyPulseLayout;
