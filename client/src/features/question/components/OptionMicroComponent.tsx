import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { OptionType } from "../Types/types";
import { responseSubmitted } from "../../../animation/index";
import AnimateOnClick from "../../../animation/AnimateOnClick";
import { baseTransition } from "../../../animation/transitions/baseTransition";

interface OptionItemProps {
  options: string[] | File[];
  type: OptionType;
  selectedOption?: string;
  disabled?: boolean;
  correctAnswer?: string; // Pass the correct
  onSelect?: (selectedOption: string) => void; // Pass the selected option
  smallSize?: boolean;
}

// Micro component for different option types
const OptionItem: React.FC<OptionItemProps> = ({
  options,
  type,
  onSelect,
  selectedOption,
  // correctAnswer = "",
  smallSize = false,
}) => {
  const theme = useTheme();

  const handleClick = (selectedOption: string | File) => {
    if (typeof selectedOption === "string" && onSelect) {
      onSelect(selectedOption);
    }
  };

  // Render based on the option type
  if (type === "correct-incorrect") {
    if (selectedOption) {
      const isCorrect = selectedOption.toString() === "right";
      return (
        <Box display="flex" fontSize={smallSize ? "30px" : "15px"}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={"100%"}
            py="18px"
            bgcolor={
              isCorrect ? "rgba(64, 64, 64, 1)" : "rgba(166, 166, 166, 1)"
            }
            color={"white"}
          >
            {isCorrect ? (
              <DoneOutlinedIcon fontSize="large" />
            ) : (
              <ClearOutlinedIcon fontSize="large" />
            )}
          </Box>
        </Box>
      );
    }
    return (
      <Box
        display="flex"
        flexDirection="row"
        sx={{ cursor: onSelect ? "pointer" : "default" }}
      >
        {/* Correct/Yes Option (Left) */}
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            bgcolor={"#F0D7FF"}
            py="18px"
            onClick={() => handleClick("right")}
          >
            <DoneOutlinedIcon
              fontSize={smallSize ? "small" : "large"}
              sx={{ color: "black" }}
            />
          </Box>
        </AnimateOnClick>

        {/* Incorrect/No Option (Right) */}
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
            bgcolor="black"
            py="18px"
            onClick={() => handleClick("wrong")}
          >
            <ClearOutlinedIcon
              fontSize={smallSize ? "small" : "large"}
              sx={{ color: "white" }}
            />
          </Box>
        </AnimateOnClick>
      </Box>
    );
  } else if (type === "text" || type === "yes-no") {
    if (
      selectedOption &&
      Array.isArray(options) &&
      typeof options[0] === "string"
    ) {
      const selectedIndex = (options as string[]).indexOf(selectedOption);
      const selectedBgColor =
        selectedIndex === 0 ? theme.palette.primary.light : "black";
      return (
        <Box display="flex" fontSize={"30px"}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={"100%"}
            py="18px"
            bgcolor={selectedBgColor}
            // border={"1px solid #464646"}
            color={"white"}
          >
            {selectedOption}
          </Box>
        </Box>
      );
    }
    return (
      <Box
        display="flex"
        sx={{ cursor: onSelect ? "pointer" : "default" }}
        fontSize={smallSize ? "15px" : "30px"}
      >
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py="18px"
            bgcolor={"#464646"}
            borderTop={`1px solid ${theme.palette.primary.main}`}
            borderRight={`1px solid ${theme.palette.primary.main}`}
            color={"white"}
            onClick={() => handleClick(options[0])}
            fontSize={smallSize ? "15px" : "30px"}
          >
            {typeof options[0] === "string" ? options[0] : ""}
          </Box>
        </AnimateOnClick>
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderTop={`1px solid ${theme.palette.primary.main}`}
            py="18px"
            color={"black"}
            bgcolor="#D9D9D9"
            onClick={() => handleClick(options[1])}
            fontSize={smallSize ? "15px" : "30px"}
          >
            {typeof options[1] === "string" ? options[1] : ""}
          </Box>
        </AnimateOnClick>
      </Box>
    );
  } else if (type === "image") {
    if (selectedOption) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          fontSize={"30px"}
          overflow={"hidden"}
        >
          <Box
            component="img"
            src={selectedOption}
            alt={"Selected Image"}
            sx={{
              maxWidth: "100%",
              maxHeight: "300px",
              cursor: "default",
            }}
          />
        </Box>
      );
    }
    return (
      <Box
        display="flex"
        sx={{ cursor: onSelect ? "pointer" : "default" }}
        fontSize={"30px"}
        overflow={"hidden"}
      >
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            component="img"
            // src={options ? options[0] : ""}
            src={
              typeof options[0] === "string"
                ? options[0]
                : options[0]?.constructor?.name === "File"
                ? URL.createObjectURL(options[0])
                : undefined
            }
            alt={"Image"}
            onClick={() => handleClick(options[0])}
            sx={{
              cursor: onSelect ? "pointer" : "default",
              maxWidth: "100%",
              width: "100%",
              height: smallSize ? "150px" : "300px",
            }}
          />
        </AnimateOnClick>
        <AnimateOnClick
          variants={responseSubmitted}
          transition={baseTransition}
        >
          <Box
            component="img"
            // src={options ? options[1] : ""}
            src={
              typeof options[1] === "string"
                ? options[1]
                : options[1]?.constructor?.name === "File"
                ? URL.createObjectURL(options[1])
                : undefined
            }
            alt={"Image"}
            onClick={() => handleClick(options[1])}
            sx={{
              maxWidth: "100%",
              width: "100%",
              cursor: onSelect ? "pointer" : "default",
              height: smallSize ? "150px" : "300px",
              objectFit: smallSize ? "fill" : "",
            }}
          />
        </AnimateOnClick>
      </Box>
    );
  } else if (type === "mcq") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          gap: "10px",
          cursor: onSelect && !selectedOption ? "pointer" : "default",
        }}
      >
        {options.map((option, index) => {
          // const isSelected = selectedOption === option;
          // // const isAnswerRevealed = !!selectedOption;
          // const isCorrect = selectedOption === correctAnswer;

          let bgColor = "white";
          // let textColor = "white";

          // if (isSelected) {
          //   if (isCorrect) {
          //     bgColor = theme.palette.primary.main;
          //     textColor = "black";
          //   } else {
          //     bgColor = theme.palette.primary.main;
          //     textColor = "black";
          //   }
          // }

          return (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              // border="1px solid white"
              p={"10px"}
              bgcolor={bgColor}
              color={"black"}
              border={`2px solid ${theme.palette.primary.main}`}
              boxShadow="0px 4px 19px 0px #CD7BFF4D inset"
              sx={{
                cursor: !selectedOption ? "pointer" : "default",
              }}
              onClick={() => {
                if (!selectedOption && onSelect && typeof option === "string") {
                  onSelect(option);
                }
              }}
            >
              <Typography fontWeight={400} fontSize={"14px"} sx={{ mr: 1 }}>
                {String.fromCharCode(97 + index).toUpperCase()}.
              </Typography>
              <Typography fontWeight={400} fontSize={"14px"}>
                {typeof option === "string"
                  ? option
                  : option instanceof File
                  ? option.name
                  : ""}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  return null;
};

export default OptionItem;
