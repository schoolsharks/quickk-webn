import { Box, IconButton, Stack, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Gift,
  Home,
  // Trophy
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CardGiftcard,
  Leaderboard,
  PeopleOutlineOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
// import { useLogoutMutation } from "../userApi";
import joinWebnBanner from "../../../assets/images/join-webn-banner.webp";

const SidebarHamburger = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // const [logout, { isLoading }] = useLogoutMutation();

  // Disable scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const tabs = [
    {
      name: "Home",
      icon: <Home size={24} strokeWidth={1.5} />,
      path: "/user/dashboard",
    },
    {
      name: "Events",
      icon: <Gift size={24} strokeWidth={1.5} />,
      path: "/user/event-mode",
    },
    {
      name: "Rewards & Resources",
      icon: <CardGiftcard sx={{ fontSize: 24, color: "black" }} />,
      path: "/user/rewards",
    },
    {
      name: "Achievers",
      icon: <Leaderboard sx={{ fontSize: 24, color: "black" }} />,
      path: "/user/leaderboard",
    },
    {
      name: "Referral",
      icon: <PeopleOutlineOutlined sx={{ fontSize: 24, color: "black" }} />,
      path: "/user/referral",
    },
    {
      name: "Profile",
      icon: <PersonOutline sx={{ fontSize: 24, color: "black" }} />,
      path: "/user/profile",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  // const handleLogout = async () => {
  //   try {
  //     await logout({}).unwrap();
  //     navigate("/user/login");
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  const renderSidebar = () => {
    // Render your sidebar here
    return (
      <motion.div
        initial={{ x: "100%", y: "10%" }}
        animate={{ x: 0, y: "10%" }}
        exit={{ x: "100%", y: "10%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: 0,
          minWidth: "180px",
          height: "80%",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(360deg, #A04AD4 0%, #E7C0FF 100%)`,
        }}
      >
        <IconButton
          onClick={() => setSidebarOpen(false)}
          sx={{ alignSelf: "flex-end" }}
        >
          <X size={24} strokeWidth={2} color="#000" />
        </IconButton>
        <Box sx={{display:"flex", justifyContent:"left", alignItems:"center", padding: "0 12px", marginBottom: "8px"}}>
          <MenuIcon
            sx={{ fontSize: 24, color: "black"}}
          />
          <Typography
            fontWeight={"700"}
            fontSize={"24px"}
            color="#000"
            paddingLeft={"8px"}
          >
            Menu
          </Typography>
        </Box>
        <Box sx={{ width: "100%", height: "1px",maxWidth: "90%",mx:"auto", backgroundColor: "#A04AD4", marginBottom: "16px" }} />
        <Stack gap="20px" padding={"0 12px"}>
          {tabs.map((tab, index) => (
            <Box
              key={index}
              display={"flex"}
              alignItems={"center"}
              color={"#000"}
              gap={"12px"}
              onClick={() => handleNavigation(tab.path)}
              sx={{
                cursor: "pointer",
                transition: "opacity 0.2s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              {tab.icon}
              <Typography
                fontSize={"18px"}
                fontWeight={"700"}
                whiteSpace="pre-line"
              >
                {tab.name}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Stack
          sx={{
            mt: "auto",
          }}
        >
          {/* <Button
            startIcon={<Logout />}
            disabled={isLoading}
            onClick={handleLogout}
            sx={{
              fontSize: "20px",
              color: "#000",
              justifyContent: "flex-start",
              mx: "8px",
            }}
          >
            Logout
          </Button> */}
          <Box
            component={"img"}
            src={joinWebnBanner}
            width="240px"
            onClick={() => navigate("/user/webn-membership")}
          />
        </Stack>
      </motion.div>
    );
  };
  return (
    <>
      <IconButton
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{ ":hover": { backgroundColor: "transparent" } }}
      >
        <Menu size={24} strokeWidth={2} color="#000" />
      </IconButton>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSidebarOpen(false)}
            className="mobile-width"
            style={{
              position: "fixed",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(2px)",
              zIndex: 998,
              overflow: "hidden",
            }}
          >
            {renderSidebar()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarHamburger;
