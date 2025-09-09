import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import GlobalButton from "../../components/ui/button";
import ReferralImage from "../../assets/images/Referral/Referral.webp";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { Sparkle } from "lucide-react";

const Referral: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleReferNow = async () => {
    const referralLink = `${window.location.origin}/signup?ref=user123`; // Replace with actual referral link
    const shareData = {
      title: "Join Gowomaniya Community",
      text: "Invite a friend. Earn 50⚡\n\nBring your friends to Gowomaniya Community and unlock exciting perks with every signup.",
      url: referralLink,
    };

    try {
      // Check if Web Share API is supported (mostly mobile browsers)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop or browsers without Web Share API
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(referralLink);
        } else {
          // Ultimate fallback
          const textArea = document.createElement("textarea");
          textArea.value = referralLink;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(referralLink);
        alert("Referral link copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
      }
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
        </Box>
      </Container>
    </Box>
  );
};

export default Referral;
