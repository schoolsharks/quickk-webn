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
import QemojiImage from "./Qemoji";
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
              color: "#96FF43",
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
              color: isCompleted ? "#96FF43" : "text.primary",
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
            color: isCompleted ? "#96FF43" : "text.primary",
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
  expanded = false,
  items = [],
  onToggle,
}) => {
  return (
    <AnimateOnScroll variants={fadeInUp} transition={baseTransition}>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={onToggle}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Checkbox
              checked={expanded}
              sx={{
                "&.Mui-checked": {
                  color: "#96FF43",
                },
              }}
            />
            <Typography variant="h5" lineHeight={"24px"}>
              {title}
            </Typography>
          </Stack>
          <Typography variant="h5">{week}</Typography>
        </Stack>

        {expanded &&
          items.map((item, index) => (
            <Module
              moduleId={item.moduleId}
              key={index}
              title={item.title}
              isCompleted={item.isCompleted}
              duration={item.duration}
            />
          ))}
      </Box>
    </AnimateOnScroll>
  );
};

interface LearningLayoutProps {
  LearningData: LearningProps[];
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
        <QemojiImage width="81px" height="81px" />
      </Stack>

      {/* Main Learnings */}
      <Box sx={{ mb: 3 }}>
        {LearningData.map((learning, idx) => (
          <React.Fragment key={idx}>
            <Box>
              <Learning
                title={learning.title}
                week={`Week ${learning.week}`}
                expanded={expandedIndex === idx}
                items={learning.items}
                onToggle={() => toggleExpand(idx)} // pass toggle function
              />
            </Box>
            {idx === 0 && (
              <Box sx={{ mt: "22px", ml: "11px" ,mb:"18px" }}>
                <ActiveLearning />
              </Box>
            )}
          </React.Fragment>
        ))}

        {/* Static Learnings */}
        <Stack mt={"18px"}>
          <Learning title="Topic 3" week="Week 3" expanded={false} items={[]} />
          <Learning title="Topic 4" week="Week 4" expanded={false} items={[]} />
          <Learning title="Topic 5" week="Week 5" expanded={false} items={[]} />
        </Stack>
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
