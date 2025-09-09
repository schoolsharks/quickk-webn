import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEventMode } from "../../features/user/userSlice";
import GlobalButton from "../../components/ui/button";
import Quickk from "../../components/ui/Quickk";
import WebnLogo from "../../assets/images/header/logo.webp";

const ModeSelection: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEventMode = () => {
    // Set event mode to true in Redux and localStorage
    dispatch(setEventMode(true));
    navigate("/user/event-mode");
  };

  const handleCommunityMode = () => {
    // Set event mode to false in Redux and localStorage
    dispatch(setEventMode(false));
    navigate("/user/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: window.innerHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 24px 20px 24px",
      }}
    >
      {/* Header with Logo */}
      <Box>
        <Box
          component="img"
          src={WebnLogo}
          border={`2px solid ${theme.palette.primary.main}`}
          borderRadius="50%"
          alt="Quickk Logo"
          sx={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            ml: 3,
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: "30px",
            marginBottom: "40px",
          }}
        >
          I'm here for...
        </Typography>

        {/* Mode Selection Buttons */}
        <Box
          mx={"auto"}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: "300px",
          }}
        >
          {/* Events Button */}
          <GlobalButton
            onClick={handleEventMode}
            fullWidth
            sx={{
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.background.paper,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "16px",
              padding: "16px",
              height: "56px",
              "&:hover": {
                backgroundColor: theme.palette.text.secondary,
              },
            }}
          >
            Events
          </GlobalButton>

          {/* Community Button */}
          <GlobalButton
            onClick={handleCommunityMode}
            fullWidth
            sx={{
              backgroundColor: "transparent",
              color: theme.palette.text.primary,
              border: `2px solid ${theme.palette.text.primary}`,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "16px",
              padding: "16px",
              height: "56px",
              "&:hover": {
                backgroundColor: theme.palette.text.primary + "10",
              },
            }}
          >
            Community
          </GlobalButton>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <Quickk />
      </Box>
    </Box>
  );
};

export default ModeSelection;
