import { Box, Typography, Stack } from "@mui/material";
import Header from "../../components/layout/Header";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";
import AnimateNumber from "../../animation/AnimateNumber";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Events from "../../features/events/components/Events";
import MyNetworks from "../../features/events/components/MyNetworks";
import Quickk from "../../components/ui/Quickk";
import StarsEarnedPopup from "../../components/ui/StarsEarnedPopup";

const EventDashboard = () => {
  const { name } = useSelector((state: RootState) => state.user);
  const theme = useTheme();
  const [showStarsPopup, setShowStarsPopup] = useState(false);

  // Initialize activeTab from localStorage or default to "events"
  const [activeTab, setActiveTab] = useState<"events" | "networks">(() => {
    const savedTab = localStorage.getItem("eventDashboardActiveTab");
    return savedTab === "events" || savedTab === "networks"
      ? savedTab
      : "events";
  });

  // Save activeTab to localStorage whenever it changes
  const handleTabChange = (tab: "events" | "networks") => {
    setActiveTab(tab);
    localStorage.setItem("eventDashboardActiveTab", tab);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if we should show stars popup from localStorage
    const shouldShowStars = localStorage.getItem("showStarsPopup");
    if (shouldShowStars === "true") {
      setShowStarsPopup(true);
    }
  }, []);

  const handleCloseStarsPopup = () => {
    setShowStarsPopup(false);
    // Remove flag from localStorage
    localStorage.removeItem("showStarsPopup");
  };

  return (
    <Box color="#000" py={"30px"}>
      {/* Header */}
      <Header />

      {/* Greeting */}
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems="center"
        px={"20px"}
      >
        <Box>
          <Typography mt={"40px"} variant="h2">
            Hello,
            <br />
            {name}
          </Typography>
          <Box
            border={`2px solid ${theme.palette.primary.main}`}
            width={"fit-content"}
            px={1}
            mt={1}
          >
            <Typography color={"black"} fontSize={14}>
              Weben Club Member
            </Typography>
          </Box>
        </Box>
        {/* <IconButton sx={{ color: "#000" }}>
          <NotificationsNoneOutlinedIcon />
        </IconButton> */}
      </Box>

      {/* Tabs */}
      <Stack direction="row" mt={"36px"} alignItems={"center"}>
        <Box
          flex={activeTab === "events" ? 1.1 : 0.9}
          sx={{
            border:
              activeTab === "events"
                ? `2px solid ${theme.palette.primary.main}`
                : "none",
            backgroundColor:
              activeTab === "events" ? "#E7CEF3" : theme.palette.text.secondary,
            color: activeTab === "events" ? "black" : "white",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: "16px",
            py: activeTab === "events" ? "24px" : "16px",
            height: activeTab === "events" ? "90px" : "80px", // Height changes based on active tab
            transition: "all 0.3s ease",
          }}
          onClick={() => handleTabChange("events")}
        >
          <Typography variant="h1" fontSize={25}>
            <AnimateNumber target={15}></AnimateNumber>
          </Typography>
          <Typography fontSize={20} fontWeight="500">
            Events
          </Typography>
        </Box>
        <Box
          flex={activeTab === "networks" ? 1.1 : 0.9}
          sx={{
            border:
              activeTab === "networks"
                ? `2px solid ${theme.palette.primary.main}`
                : "none",
            backgroundColor:
              activeTab === "networks"
                ? "#E7CEF3"
                : theme.palette.text.secondary,
            color: activeTab === "networks" ? "black" : "white",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: "16px",
            py: activeTab === "networks" ? "24px" : "16px",
            height: activeTab === "networks" ? "90px" : "80px", // Height changes based on active tab
            transition: "all 0.3s ease",
          }}
          onClick={() => handleTabChange("networks")}
        >
          <Typography variant="h1" fontSize={25}>
            <AnimateNumber target={1}></AnimateNumber>
          </Typography>
          <Typography fontSize={20} fontWeight="500">
            My Networks
          </Typography>
        </Box>
      </Stack>

      {/* Tab Content */}
      <Box mt={2}>{activeTab === "events" ? <Events /> : <MyNetworks />}</Box>
      <Box mx={"25px"}>
        <Quickk />
      </Box>

      {/* Stars Earned Popup */}
      <StarsEarnedPopup
        open={showStarsPopup}
        stars={50}
        onClose={handleCloseStarsPopup}
      />
    </Box>
  );
};

export default EventDashboard;
