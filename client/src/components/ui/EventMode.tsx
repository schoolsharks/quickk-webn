import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { toggleEventMode } from "../../features/user/userSlice";

const EventModeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eventMode } = useSelector((state: RootState) => state.user);

  const handleToggle = () => {
    dispatch(toggleEventMode());
    // Navigate immediately after toggling
    if (eventMode) {
      // Currently in event mode, switching to community mode
      navigate("/user/dashboard");
    } else {
      // Currently in community mode, switching to event mode
      navigate("/user/event-mode");
    }
  };

  return (
    <Box display={"flex"} flexDirection="column" alignItems="center">
      <Box
        sx={{
          width: 50,
          height: 18,
          bgcolor: eventMode ? "#0E0E0E" : "#CD7BFF",
          display: "flex",
          alignItems: "center",
          p: "2px",
          cursor: "pointer",
          borderRadius: "2px",
        }}
        onClick={handleToggle}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            bgcolor: eventMode ? "#CD7BFF" : "#0E0E0E",
            ml: eventMode ? "auto" : 0,
            transition: "all 0.3s ease",
            borderRadius: "1px",
          }}
        />
      </Box>
      <Box display="flex" alignItems="center" mt={0.5}>
        <Typography color="black" fontSize={12}>
          Event Mode
        </Typography>
      </Box>
    </Box>
  );
};

export default EventModeToggle;
