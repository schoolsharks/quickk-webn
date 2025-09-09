import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../../components/ui/button";
import ReferralImage from "../../assets/images/Referral/Referral.webp";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { Sparkle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const Referral: React.FC = () => {
  const theme = useTheme();
  const { userId } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReferNow = async () => {
    const referralLink = `${window.location.origin}/user/login?ref=${userId}`;
    const shareMessage = `I'm part of a Gowomaniya community that brings together entrepreneurs, homepreneurs, investors & job seekers. Let's grow together.\nJoin here: ${referralLink}`;
    
    const shareData = {
      text: shareMessage,
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        await handleCopyLink();
      }
    } catch (error) {
      console.error("Error sharing:", error);

      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    const referralLink = `${window.location.origin}/user/login?ref=${userId}`;
    const shareMessage = `I'm part of a Gowomaniya community that brings together entrepreneurs, homepreneurs, investors & job seekers. Let's grow together.\nJoin here: ${referralLink}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareMessage);
        setSnackbarOpen(true);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error copying link:", error);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Header with back button */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          py: 1,
          px: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={handleBack} sx={{ p: 1 }}>
            <ArrowBackIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            Referral
          </Typography>
        </Stack>
      </Box>

      <Container maxWidth="sm" sx={{ px: 0, mt: "40px" }}>
        {/* Purple background section with image */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={ReferralImage}
            alt="Referral illustration"
            sx={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: "100%",
            }}
          />
        </Box>

        {/* Content section */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            p: 3,
          }}
        >
          {/* Never expires tag */}
          <Typography
            sx={{
              color: "black",
              fontSize: "16px",
              fontWeight: 500,
              mb: 1,
            }}
          >
            Never expires
          </Typography>

          <Box display={"flex"} alignItems={"center"} mb={2}>
            {/* Main title */}
            <Typography
              sx={{
                color: theme.palette.text.primary,
                fontSize: "25px",
                fontWeight: 700,
              }}
            >
              Invite a friend. Earn 50
            </Typography>
            <StarsOutlinedIcon sx={{ ml: 0.5, fontSize: "24px" }} />
          </Box>

          {/* Description */}
          <Typography
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "16px",
              fontWeight: 400,
              mb: 4,
              lineHeight: 1.5,
            }}
          >
            Bring your friends to Gowomaniya Community and unlock exciting perks
            with every signup.
          </Typography>

          {/* Benefits section */}
          <Stack spacing={3} sx={{ mb: 4 }}>
            {/* Earn 50 Stars per Referral */}
            <Stack direction="row" spacing={2}>
              <Sparkle fill="black" />
              <Box>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "18px",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Earn 50 Stars per Referral
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                >
                  When your friend joins and registers, you'll receive 50 stars
                  instantly.
                </Typography>
              </Box>
            </Stack>

            {/* More Referrals, More Rewards */}
            <Stack direction="row" spacing={2}>
              <Sparkle fill="black" />
              <Box>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "18px",
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  More Referrals, More Rewards
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                >
                  Collect stars through referrals and unlock exclusive offers
                  and benefits.
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Refer Now Button */}
          {/* <GlobalButton
            onClick={handleReferNow}
            sx={{
              backgroundColor: "#404040",
              color: "#FFFFFF",
              borderRadius: "0px",
              fontWeight: 600,
              fontSize: "16px",
              textTransform: "none",
              py: 2,
            }}
          >
            Refer Now
          </GlobalButton> */}
        </Box>
      </Container>
      <Stack direction={"row"}>
        <GlobalButton
          onClick={handleReferNow}
          sx={{
            backgroundColor: "#404040",
            color: "#FFFFFF",
            borderRadius: "0px",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            py: 2,
          }}
        >
          Refer Now
        </GlobalButton>
        <GlobalButton
          onClick={handleCopyLink}
          sx={{
            backgroundColor: "transparent",
            color: "primary.main",
            borderRadius: "0px",
            border: `1px solid ${theme.palette.primary.main}`,
            fontWeight: 700,
            fontSize: "16px",
            textTransform: "none",
            py: 2,
          }}
        >
          Copy Link
        </GlobalButton>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Referral link copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Referral;
