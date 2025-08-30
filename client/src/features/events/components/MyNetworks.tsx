import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import NetworkSearch from "./NetworkSearch";
import BottomNavigation from "../../../components/ui/BottomNavigation";

const MyNetworks = () => {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate("/user/complete-profile");
  };
  const theme = useTheme();
  return (
    <Box py={"8px"} display={"flex"} flexDirection={"column"} gap={8} mb={6}>
      <Box
        mt={"60px"}
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
          <CallMadeOutlinedIcon sx={{ fontSize: 35 }} />
        </Box>
      </Box>

      <NetworkSearch />
      <BottomNavigation />
    </Box>
  );
};

export default MyNetworks;
