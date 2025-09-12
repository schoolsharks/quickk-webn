import { Box, Typography } from "@mui/material";
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
  // Use real pulse stats if available, otherwise generate dummy data for fallback
  const generateResultData = (): ResultData[] => {
    // If we have real pulse stats, use them
    if (pulseStats && pulseStats.results.length > 0) {
      return pulseStats.results.map(stat => ({
        option: stat.option,
        percentage: stat.percentage,
        isSelected: stat.option === selectedOption
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
    const selectedResult = resultData.find(result => result.isSelected);
    if (!selectedResult) return null;

    const isCorrect = selectedResult.option === "right";
    
    return (
      <Box display="flex" flexDirection="column" height="70px" bgcolor="#CD7BFF4D">
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          px={2} 
          py={1}
          flex={1}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: smallSize ? "10px" : "12px" }}>
              Your choice
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="center">
              {isCorrect ? (
                <DoneOutlinedIcon fontSize={smallSize ? "small" : "medium"} sx={{ color: "black" }} />
              ) : (
                <ClearOutlinedIcon fontSize={smallSize ? "small" : "medium"} sx={{ color: "black" }} />
              )}
            </Box>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: smallSize ? "10px" : "12px" }}>
              Selected by
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="black">
              {pulseStats ? `${selectedResult.percentage}%` : "Loading..."}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  } else if (type === "text") {
    const selectedResult = resultData.find(result => result.isSelected);
    if (!selectedResult) return null;

    // Find the option letter/index
    const selectedOptionIndex = (options as string[]).indexOf(selectedResult.option);
    const optionLetter = selectedOptionIndex === 0 ? "A" : "B";
    
    return (
      <Box display="flex" flexDirection="column" height="70px" bgcolor="#CD7BFF4D">
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          px={2} 
          py={1}
          flex={1}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: smallSize ? "10px" : "12px" }}>
              Your choice
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="black">
              {optionLetter}
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: smallSize ? "10px" : "12px" }}>
              Selected by
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="black">
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
