import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NetworkSearch from "./NetworkSearch";
import BottomNavigation from "../../../components/ui/BottomNavigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { isProfileComplete } from "../../../utils/profileUtils";
// import { ArrowRight } from "lucide-react";
import { CallMadeOutlined } from "@mui/icons-material";

const MyNetworks = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.user);

  // Check if profile is complete
  const profileComplete = isProfileComplete(user);

  const handleProfileClick = () => {
    navigate("/user/complete-profile");
  };

  return (
    <Box py={"8px"} display={"flex"} flexDirection={"column"} gap={8}>
      {/* Conditionally render Complete Profile section only if profile is incomplete */}
      {!profileComplete && (
        <Box
          mt="60px"
          display="flex"
          borderTop={`2px solid ${theme.palette.primary.main}`}
          borderBottom={`2px solid ${theme.palette.primary.main}`}
          justifyContent="space-between"
          alignItems="center"
          onClick={handleProfileClick}
          p={"38px 24px"}
          sx={{ cursor: "pointer" }}
        >
          <Box>
            <Typography
              variant="h2"
              fontSize={"20px"}
              color="#000"
              sx={{ textWrap: "nowrap" }}
            >
              Complete Your Profile
            </Typography>
            <Typography variant="h3" fontSize={"16px"} mt={1}>
              Hardly takes 2 mins
            </Typography>
          </Box>
          <Box>
            {/* <ArrowRight size={36} strokeWidth={1.75} rotate={"45deg"} /> */}
            <CallMadeOutlined sx={{ fontSize: 35, marginRight: "24px" }} />
          </Box>
        </Box>
      )}

      {profileComplete && <Box mt={"40px"} />}
      <NetworkSearch />
      <BottomNavigation />
    </Box>
  );
};

export default MyNetworks;
