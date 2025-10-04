import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Checkbox,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
// import QemojiImage from "./Qemoji";
import { LearningProps, ModuleProps } from "../../Types/types";
import AnimateOnScroll from "../../../../animation/AnimateOnScroll";
import { fadeInUp } from "../../../../animation";
import { baseTransition } from "../../../../animation/transitions/baseTransition";
import ActiveLearning from "../../../../components/ui/ActiveLearning";
import { theme } from "../../../../theme/theme";

const Module: React.FC<ModuleProps> = ({
  moduleId,
  title,
  isCompleted = false,
  duration,
}) => {
  const navigate = useNavigate();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center">
        <Checkbox
          checked={isCompleted}
          sx={{
            color: "#A6A6A6",
            "&.Mui-checked": {
              color: "primary.main",
            },
          }}
        />

        <Button
          disableRipple
          disabled={isCompleted}
          onClick={() => {
            navigate(`/user/module/${moduleId}`);
          }}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&:active": {
              backgroundColor: "transparent",
            },
            "&:focus": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Typography
            variant="h6"
            fontSize={"14px"}
            sx={{
              color: isCompleted ? "primary.main" : "text.primary",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {title}
          </Typography>
        </Button>
      </Stack>

      {duration && (
        <Typography
          variant="h6"
          fontSize={"14px"}
          sx={{
            textDecoration: isCompleted ? "underline" : "none",
            color: isCompleted ? "primary.main" : "text.primary",
            textWrap: "nowrap",
          }}
        >
          {duration}
        </Typography>
      )}
    </Stack>
  );
};

const Learning: React.FC<LearningProps> = ({
  title,
  week,
  videoUrl,
  expanded = false,
  items = [],
  onToggle,
}) => {
  const navigate = useNavigate();

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggle) onToggle();
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoUrl) {
      navigate(`/user/video/${videoUrl}`);
    }
  };

  return (
    <AnimateOnScroll variants={fadeInUp} transition={baseTransition}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          onClick={handleCheckboxClick}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Checkbox
              checked={expanded}
              onClick={handleCheckboxClick}
              sx={{
                "&.Mui-checked": {
                  color: "primary.main",
                },
              }}
            />
            <Typography
              variant="h5"
              lineHeight={"24px"}
              // sx={{
              //   flexGrow: 1, // Makes the entire text area clickable
              // }}
            >
              {title}
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ textWrap: "nowrap" }}>
            {week}
          </Typography>
        </Stack>

        {expanded && (
          <>
            {videoUrl && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center">
                  <Checkbox
                    // checked={isCompleted}
                    sx={{
                      color: "#A6A6A6",
                      "&.Mui-checked": {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />

                  <Button
                    disableRipple
                    // disabled={isCompleted}
                    onClick={handleTitleClick}
                    sx={{
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      "&:active": {
                        backgroundColor: "transparent",
                      },
                      "&:focus": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontSize={"14px"}
                      sx={{
                        color: "text.primary",
                        textAlign: "left",
                        cursor: videoUrl ? "pointer" : "default",
                      }}
                    >
                      Introduction
                    </Typography>
                  </Button>
                </Stack>
              </Stack>
            )}
            {items.map((item, index) => (
              <Module
                moduleId={item.moduleId}
                key={index}
                title={item.title}
                isCompleted={item.isCompleted}
                duration={item.duration}
              />
            ))}
          </>
        )}
      </Box>
    </AnimateOnScroll>
  );
};

interface LearningLayoutProps {
  LearningData: Array<{
    week: number;
    title: string;
    videoUrl?: string; // Add this
    items: Array<{
      moduleId: string;
      title: string;
      duration: string;
      isCompleted: boolean;
    }>;
  }>;
}

const LearningLayout: React.FC<LearningLayoutProps> = ({ LearningData }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/user/dashboard");
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // Sort learning data: expanded learning first, then by week in ascending order
  const sortedLearningData = [...LearningData].sort((a, b) => {
    const aIndex = LearningData.findIndex((item) => item.week === a.week);
    const bIndex = LearningData.findIndex((item) => item.week === b.week);
    const aExpanded = expandedIndex === aIndex;
    const bExpanded = expandedIndex === bIndex;

    // Priority 1: Expanded learning goes to top
    if (aExpanded && !bExpanded) return -1;
    if (!aExpanded && bExpanded) return 1;

    // Priority 2: If neither is expanded, sort by week
    if (!aExpanded && !bExpanded) {
      return a.week - b.week;
    }

    // If both are expanded (shouldn't happen), sort by week
    return a.week - b.week;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ p: "66px 24px 16px 14px" }}>
      {/* Header UI */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: "44px" }}
      >
        <Stack direction="row" alignItems="center">
          <IconButton sx={{ color: "text.primary" }} onClick={navigateToHome}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h1" fontSize={"25px"}>
            Learnings
          </Typography>
        </Stack>
        {/* <QemojiImage width="81px" height="81px" /> */}
      </Stack>

      {/* Main Learnings */}
      <Box sx={{ mb: 3 }}>
        {sortedLearningData.map((learning, idx) => {
          const originalIndex = LearningData.findIndex(
            (item) => item.week === learning.week
          );
          return (
            <React.Fragment key={learning.week}>
              <Box>
                <Learning
                  title={learning.title}
                  week={`Week ${learning.week}`}
                  videoUrl={learning.videoUrl} // Add this line
                  expanded={expandedIndex === originalIndex}
                  items={learning.items}
                  onToggle={() => toggleExpand(originalIndex)}
                />
              </Box>
              {idx === 0 && (
                <Box sx={{ mt: "22px", ml: "11px", mb: "18px" }}>
                  <ActiveLearning />
                </Box>
              )}
            </React.Fragment>
          );
        })}

        {/* Static Learnings */}
        {/* <Stack mt={"18px"}>
          <Learning title="Topic 3" week="Week 3" expanded={false} items={[]} />
          <Learning title="Topic 4" week="Week 4" expanded={false} items={[]} />
          <Learning title="Topic 5" week="Week 5" expanded={false} items={[]} />
        </Stack> */}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: theme.palette.primary.main,
          ml: "11px",
          p: "14px",
          mt: "20px",
        }}
      >
        <Typography variant="body1" fontSize={"18px"} color="black">
          Upcoming Challenge{" "}
          {(() => {
            const today = new Date();
            const nextMonth = new Date(
              today.getFullYear(),
              today.getMonth() + 1,
              1
            );
            const options: Intl.DateTimeFormatOptions = {
              day: "numeric",
              month: "long",
              year: "numeric",
            };
            return nextMonth.toLocaleDateString("en-US", options);
          })()}
        </Typography>
      </Box>
    </Box>
  );
};

export default LearningLayout;
