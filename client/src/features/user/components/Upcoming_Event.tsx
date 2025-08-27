import { Box, Typography } from "@mui/material";
import React from "react";
import QuestionTwoOption from "../../question/components/QuestionTwoOption";

const Upcoming_Event: React.FC = () => {
  return (
    <Box
      display={"flex"}
      gap={2}
      flexDirection={"column"}
      px={"20px"}
      justifyContent={"flex-start"}
    >
      <Typography variant="h4" textAlign={"left"}>
        Upcoming Events
      </Typography>
      <QuestionTwoOption
        id={""}
        questionText={"RSVP ?"}
        image={
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        optionType={"text"}
        options={["Yes", "No"]}
      />
    </Box>
  );
};

export default Upcoming_Event;
