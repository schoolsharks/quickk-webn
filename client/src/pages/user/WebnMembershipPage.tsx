import { useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { theme } from "../../theme/theme";
import AnimateOnScroll from "../../animation/AnimateOnScroll";
import { fadeInUp } from "../../animation";
import { baseTransition } from "../../animation/transitions/baseTransition";

// Import an existing image as placeholder
import membershipImage from "../../assets/images/user/foundation.png";

const WebnMembershipPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigateBack = () => {
    navigate("/user/profile");
  };

  const handleApplyNow = () => {
    // Add your application logic here
    console.log("Applying for WEBN Membership");
  };

  const membershipSteps = [
    {
      icon: <PersonIcon sx={{ color: theme.palette.primary.main }} />,
      title: "Fill a form and check your eligibility.",
    },
    {
      icon: <CalendarTodayIcon sx={{ color: theme.palette.primary.main }} />,
      title: "Wait to get approved within 24 hours.",
    },
    {
      icon: <EmailIcon sx={{ color: theme.palette.primary.main }} />,
      title: "You'll receive a confirmation email once approved.",
    },
  ];

  const benefits = [
    "You meet like minded people to connect.",
    "You grow together with no direct competition within the group, as you are one and only in your coffee.",
    "You get referral business from members (their connections).",
    "We believe in Power of words- coming through reviews & recommendation.",
    "Everyone helps you to give your best to grow your business.",
    "You learn about how to grow your business from the best in the business through our guest speakers, expert invitees and workshops and collaborations partners.",
    "You get a huge exposure to the local happenings, seminars, and business meets, get invitations to be a part of these potential network to mingle with the \"who's who\" of the business world.",
    "Getting recognition, appreciations and awards for all your efforts.",
  ];

  return (
    <Box sx={{ pt: "20px", pb: "20px" }}>
      {/* Header */}
      <Stack spacing={1} px={"20px"}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
        >
          <IconButton sx={{ color: "text.primary" }} onClick={navigateBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h1" fontSize={"25px"}>
            Webn Membership
          </Typography>
        </Box>
      </Stack>

      {/* Hero Image */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box
          sx={{
            width: "100%",
            height: "200px",
            backgroundImage: `url(${membershipImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            mt: 2,
            mb: 3,
          }}
        />
      </AnimateOnScroll>

      {/* Title */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Typography
          variant="h2"
          fontSize={"28px"}
          fontWeight={"bold"}
          textAlign="center"
          px={"20px"}
          mb={4}
        >
          WEBN Membership
        </Typography>
      </AnimateOnScroll>

      {/* How to get WEBN Membership */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box px={"20px"} mb={4}>
          <Typography
            variant="h3"
            fontSize={"20px"}
            fontWeight={"600"}
            mb={2}
            sx={{ color: theme.palette.primary.main }}
          >
            How to get WEBN Membership?
          </Typography>
          <Stack spacing={2}>
            {membershipSteps.map((step, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="flex-start"
                gap={2}
                p={2}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "8px",
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    minWidth: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="body1" fontSize={"16px"}>
                  {step.title}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </AnimateOnScroll>

      {/* Benefits Section */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box px={"20px"} mb={4}>
          <Typography
            variant="h3"
            fontSize={"20px"}
            fontWeight={"600"}
            mb={2}
            sx={{ color: theme.palette.primary.main }}
          >
            Benefits of joining WEBN
          </Typography>
          <List sx={{ padding: 0 }}>
            {benefits.map((benefit, index) => (
              <ListItem
                key={index}
                sx={{
                  padding: "8px 0",
                  alignItems: "flex-start",
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px", mt: 0.5 }}>
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      bgcolor: "text.primary",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={benefit}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      lineHeight: "1.5",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </AnimateOnScroll>

      {/* About WEBN */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box px={"20px"} mb={4}>
          <Typography
            variant="h3"
            fontSize={"20px"}
            fontWeight={"600"}
            mb={2}
            sx={{ color: theme.palette.primary.main }}
          >
            About WEBN
          </Typography>
          <Typography
            variant="body1"
            fontSize={"14px"}
            lineHeight={1.6}
            mb={2}
            textAlign="justify"
          >
            An initiative by a group of women entrepreneurs to provide a social
            platform encourage, guide & build a support system for aspiring
            women entrepreneurs. This platform came into existence to build
            confidence in women in order to explore entrepreneurial
            opportunities to building skill sets as well as a strong motivated
            mind set.
          </Typography>
          <Typography
            variant="body1"
            fontSize={"14px"}
            lineHeight={1.6}
            textAlign="justify"
          >
            With a simple buy-sell model, the platform provides easy access to
            buyers to purchase home-crafted, handmade, eco friendly, and other
            such products as well as services while providing an impactful
            online (and on-ground) marketplace for sellers (Goal: women
            entrepreneurs) to grow their visibility & reach.
          </Typography>
        </Box>
      </AnimateOnScroll>

      {/* Apply Now Button */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box px={"20px"}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleApplyNow}
            sx={{
              bgcolor: theme.palette.text.secondary,
              color: "white",
              py: 2,
              fontSize: "16px",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": {
                bgcolor: theme.palette.text.secondary,
                opacity: 0.9,
              },
            }}
          >
            Apply now
          </Button>
        </Box>
      </AnimateOnScroll>
    </Box>
  );
};

export default WebnMembershipPage;
