import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { OptionType } from "../Types/types";

interface OptionResultsProps {
  options: string[] | File[];
  type: OptionType;
  selectedOption: string;
  smallSize?: boolean;
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

interface ResultData {
  option: string;
  percentage: number;
  isSelected: boolean;
}

// Component to display percentage-based results after user selects an option
const OptionResultsComponent: React.FC<OptionResultsProps> = ({
  options,
  type,
  selectedOption,
  pulseStats,
  smallSize = false,
}) => {
  const theme = useTheme();
  // Use real pulse stats if available, otherwise generate dummy data for fallback
  const generateResultData = (): ResultData[] => {
    // If we have real pulse stats, use them
    console.log("Using real pulse stats:", pulseStats);
    if (pulseStats && pulseStats.results.length > 0) {
      return pulseStats.results.map((stat) => ({
        option: stat.option,
        percentage: stat.percentage,
        isSelected: stat.option === selectedOption[0],
      }));
    }

    // Fallback to dummy data generation for backward compatibility
    if (type === "correct-incorrect") {
      const rightSelected = selectedOption === "right";
      return [
        {
          option: "right",
          percentage: rightSelected ? 65 : 35, // Show realistic percentages
          isSelected: rightSelected,
        },
        {
          option: "wrong",
          percentage: rightSelected ? 35 : 65,
          isSelected: !rightSelected,
        },
      ];
    } else if (
      type === "text" &&
      Array.isArray(options) &&
      typeof options[0] === "string"
    ) {
      const firstOptionSelected = selectedOption === options[0];
      return [
        {
          option: options[0] as string,
          percentage: firstOptionSelected ? 70 : 30, // Show realistic percentages
          isSelected: firstOptionSelected,
        },
        {
          option: options[1] as string,
          percentage: firstOptionSelected ? 30 : 70,
          isSelected: !firstOptionSelected,
        },
      ];
    }
    return [];
  };

  const resultData = generateResultData();

  // Render based on the option type
  if (type === "correct-incorrect") {
    const selectedResult = resultData.find((result) => result.isSelected);
    if (!selectedResult) return null;

    const isCorrect = selectedResult.option === "right";
    // Determine if this is option 1 (right/correct) or option 2 (wrong/incorrect)
    const isOption1 = isCorrect;
    const backgroundColor = isOption1 ? "#464646" : "#D9D9D9";

    return (
      <Box
        display="flex"
        flexDirection="column"
        height="85px"
        bgcolor={backgroundColor}
        py="18px"
        borderTop={`1px solid ${theme.palette.primary.main}`}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={4}
          flexDirection={isOption1 ? "row" : "row-reverse"}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: smallSize ? "10px" : "12px" }}
            >
              Your choice
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              {isCorrect ? (
                <DoneOutlinedIcon
                  fontSize={smallSize ? "small" : "medium"}
                  sx={{ color: isOption1 ? "white" : "black" }}
                />
              ) : (
                <ClearOutlinedIcon
                  fontSize={smallSize ? "small" : "medium"}
                  sx={{ color: isOption1 ? "white" : "black" }}
                />
              )}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontSize: smallSize ? "10px" : "12px" }}
            >
              Selected by
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={isOption1 ? "white" : "black"}
            >
              {pulseStats ? `${selectedResult.percentage}%` : "Loading..."}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  } else if (type == "text" || type === "yes-no" || type === "agree-disagree") {
    const selectedResult = resultData.find((result) => result.isSelected);
    // console.log(resultData);
    // console.log("Selected result for text option:", selectedResult);
    if (!selectedResult) return null;

    // Find the option index to determine if it's option 1 or option 2
    const selectedOptionIndex = (options as string[]).indexOf(
      selectedResult.option
    );
    const isOption1 = selectedOptionIndex === 0;
    const backgroundColor = isOption1 ? "#464646" : "#D9D9D9";

    return (
      <Box
        display="flex"
        flexDirection="column"
        height="85px"
        bgcolor={backgroundColor}
        py="18px"
        borderTop={`1px solid ${theme.palette.primary.main}`}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={4}
          flexDirection={isOption1 ? "row" : "row-reverse"}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="body2"
              color={isOption1 ? "white" : "black"}
              sx={{ fontSize: smallSize ? "10px" : "12px" }}
            >
              Your choice
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={isOption1 ? "white" : "black"}
            >
              {selectedOption}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="body2"
              color={isOption1 ? "white" : "black"}
              sx={{ fontSize: smallSize ? "10px" : "12px" }}
            >
              Selected by
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={isOption1 ? "white" : "black"}
            >
              {pulseStats ? `${selectedResult.percentage}%` : "Loading..."}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

export default OptionResultsComponent;
