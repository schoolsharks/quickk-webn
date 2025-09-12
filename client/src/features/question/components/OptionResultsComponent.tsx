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
  smallSize = false,
}) => {
  const theme = useTheme();

  // Generate dummy percentage data based on selected option
  const generateResultData = (): ResultData[] => {
    if (type === "correct-incorrect") {
      const rightSelected = selectedOption === "right";
      return [
        {
          option: "right",
          percentage: 40,
          //   rightSelected ? 40 : 60, // 60-90% if selected, 10-50% if not
          isSelected: rightSelected,
        },
        {
          option: "wrong",
          percentage: 60,
          //   rightSelected ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 30) + 60, // 10-50% if not selected, 60-90% if selected
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
          percentage: 80,
          //   firstOptionSelected ? 40,
          isSelected: firstOptionSelected,
        },
        {
          option: options[1] as string,
          percentage: 20,
          //    firstOptionSelected ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 30) + 60,
          isSelected: !firstOptionSelected,
        },
      ];
    }
    return [];
  };

  const resultData = generateResultData();

  // Render based on the option type
  if (type === "correct-incorrect") {
    return (
      <Box display="flex" height="70px">
        {resultData.map((result) => {
          const isCorrect = result.option === "right";
          const isSelected = result.isSelected;

          return (
            <Box
              key={result.option}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width={`${result.percentage}%`}
              bgcolor={
                isSelected
                  ? isCorrect
                    ? "rgba(64, 64, 64, 1)"
                    : "rgba(166, 166, 166, 1)"
                  : isCorrect
                  ? "rgba(64, 64, 64, 0.3)"
                  : "rgba(166, 166, 166, 0.3)"
              }
              color="white"
              sx={{
                transition: "all 0.3s ease-in-out",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={0.5}
              >
                {isCorrect ? (
                  <DoneOutlinedIcon fontSize={smallSize ? "small" : "medium"} />
                ) : (
                  <ClearOutlinedIcon
                    fontSize={smallSize ? "small" : "medium"}
                  />
                )}
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {result.percentage}%
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  } else if (type === "text") {
    return (
      <Box display="flex" height="70px">
        {resultData.map((result, index) => (
          <Box
            key={result.option}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width={`${result.percentage}%`}
            bgcolor={
              result.isSelected
                ? index === 0
                  ? theme.palette.primary.light
                  : "black"
                : index === 0
                ? theme.palette.primary.light + "50"
                : "rgba(0,0,0,0.5)"
            }
            borderTop={`1px solid ${theme.palette.primary.main}`}
            borderRight={
              index === 0 ? `1px solid ${theme.palette.primary.main}` : "none"
            }
            color={result.isSelected ? "white" : "black"}
            sx={{
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Typography
              variant={smallSize ? "body2" : "body1"}
              fontWeight="bold"
              textAlign="center"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: result.percentage > 30 ? "normal" : "nowrap",
                fontSize: smallSize
                  ? "12px"
                  : result.percentage > 50
                  ? "16px"
                  : "14px",
                px: 1,
              }}
            >
              {result.percentage > 30 ? result.option : ""}
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ fontSize: smallSize ? "10px" : "12px" }}
            >
              {result.percentage}%
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};

export default OptionResultsComponent;
