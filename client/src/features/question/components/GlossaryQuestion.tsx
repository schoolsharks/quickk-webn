import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { QuestionProps } from "../Types/types";

const GlossaryQuestion: React.FC<QuestionProps> = ({
  slideType = "main",
  questions = [],
  explanation = "",
  explanationNumber = 1,
  // isLastSlide = false,
  // onAnswer,
  sx = {},
}) => {
  const theme = useTheme();

  // const handleAction = () => {
  //   onAnswer && onAnswer("wrong", "");
  // };

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        width: "100%",
        height: "100%",
        overflow: "scroll",
        position: "relative",
      }}
    >
      {slideType === "main" && (
        <>
          {/* Main Question Content - Multiple Questions */}
          <Box bgcolor={theme.palette.primary.main} minHeight={"300px"}>
            <Box
              p={"8px 24px"}
              sx={{ ...sx }}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-around"}
              alignContent={"center"}
              mx={"auto"}
            >
              {questions.map((question: any, index: number) => (
                <Box key={index} mb={"0px"}>
                  <Typography variant="h5" fontSize={"18px"} color="black">
                    {question.questionNumber}. {question.questionSubHeading}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Complete Button - Only show on last slide */}
            {/* {isLastSlide && (
              <Box textAlign="center">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleAction}
                  sx={{
                    borderRadius: "0",
                    background: "rgba(64, 64, 64, 1)",
                    color: "white",
                    py: "8px",
                    fontSize: "20px",
                  }}
                >
                  Next
                </Button>
              </Box>
            )} */}
          </Box>
        </>
      )}

      {slideType === "explanation" && (
        <Box
          // bgcolor={theme.palette.primary.main}
          bgcolor={"#fff"}
          border={`2px solid ${theme.palette.primary.main}`}
          boxShadow="0px 4px 19px 0px #CD7BFF4D inset"
          color={"black"}
          display={"flex"}
          flexDirection="column"
          // justifyContent={"space-between"}
          justifyContent={"center"}
          paddingBottom={"40px"}
          minHeight={"350px"}
          // alignContent={"center"}
          // gap={1}
          // height={"100%"}
        >
          <Box
            p={"8px 16px"}
            display={"flex"}
            flexDirection="row"
            alignContent={"center"}
            gap={1}
          >
            <Typography fontFamily={"16px"} color="black" mt={2.5}>
              {explanationNumber}.{" "}
            </Typography>
            <Box
              sx={{ fontSize: "16px" }}
              dangerouslySetInnerHTML={{ __html: explanation }}
            />
            {/* <Box
              sx={{ fontSize: "16px" }}
              dangerouslySetInnerHTML={{ __html: explanation }}
            /> */}
          </Box>
          {/* Complete Button - Only show on last slide */}
          {/* {isLastSlide && (
            <Box
              textAlign="center"
              sx={{ position: "fixed", left: "0", right: "0", bottom: "0" }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={handleAction}
                sx={{
                  borderRadius: "0",
                  background: "rgba(64, 64, 64, 1)",
                  color: "white",
                  py: "8px",
                  fontSize: "20px",
                  width: "100%",
                }}
              >
                Next
              </Button>
            </Box>
          )} */}
        </Box>
      )}
    </Box>
  );
};

export default GlossaryQuestion;
