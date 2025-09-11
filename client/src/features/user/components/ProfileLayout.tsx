import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  // Collapse,
  Grid,
  Collapse,
} from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
// import badge1 from "../../../assets/images/user/MedalBlue.png";
// import badge2 from "../../../assets/images/user/GoldMedal.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../theme/theme";
import ActiveLearning from "../../../components/ui/ActiveLearning";
import amajon from "../../../assets/images/user/amajon.png";
import starbucks from "../../../assets/images/user/starbucks.png";
import foundation from "../../../assets/images/WebnMembership/WebnMembership.webp";
import watch from "../../../assets/images/user/watch.png";
// import Badge from "../../../components/ui/badge";
// import Certificate from "../../../components/ui/certificate";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import AnimateOnScroll from "../../../animation/AnimateOnScroll";
import { fadeInUp } from "../../../animation";
import { baseTransition } from "../../../animation/transitions/baseTransition";
import { ArrowRight } from "lucide-react";
import { isProfileComplete } from "../../../utils/profileUtils";

const ProfileLayout = () => {
  // const [badgesOpen, setBadgesOpen] = useState(false);
  // const [certificatesOpen, setCertificatesOpen] = useState(false);
  const [businessDetailsOpen, setBusinessDetailsOpen] = useState(true);
  const navigate = useNavigate();
  const {
    totalStars,
    redeemedStars,
    name,
    address,
    contact,
    companyMail,
    businessCategory,
    designation,
    currentStage,
    communityGoal,
    interestedEvents,
    businessLogo,
  } = useSelector((state: RootState) => state.user);
  const user = useSelector((state: RootState) => state.user);

  const navigateToHome = () => {
    navigate("/user/dashboard");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const offers = [
    {
      title: "Logo Designing",
      text: "Your brand deserves a face. Get a custom logo designed.",
      subtitle: "5000 INR",
      img: amajon,
      bgcolor: "#FFF",
    },
    {
      title: "Social Media Management",
      text: "Grow your audience with engaging content and consistent strategy.",
      subtitle: "12000 INR",
      img: starbucks,
      bgcolor: "#FFF",
    },
    {
      title: "E-commerce Store Setup",
      text: "Launch your online store with seamless checkout and product management.",
      subtitle: "Offer Flat 15% off",
      img: foundation,
      bgcolor: "#FFF",
    },
    {
      title: "UI/UX Design",
      text: "Modern, user-friendly design that makes customers stay and convert.",
      subtitle: "20% off",
      img: watch,
      bgcolor: "#FFF",
    },
  ];

  // Check if profile is complete
  const profileComplete = isProfileComplete(user);

  return (
    <Box sx={{ pt: "50px", pb: "50px" }}>
      {/* Profile Header */}
      <Stack spacing={1} px={"20px"}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          gap={1}
          alignItems={"center"}
        >
          <IconButton sx={{ color: "text.primary" }} onClick={navigateToHome}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h1" fontSize={"25px"}>
            Profile
          </Typography>
        </Box>
        {/* <Typography
          variant="body1"
          sx={{ textDecoration: "underline" }}
          pl="52px"
        >
          Company - Quickk
        </Typography> */}
      </Stack>

      {/* Personal Details */}

      <Box sx={{ mt: "52px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={"24px"}
        >
          <Typography fontSize={"20px"} fontWeight={"500"}>
            Personal Details
          </Typography>
        </Stack>
        <Stack mt={2} sx={{ p: "36px 24px", bgcolor: "#CD7BFF4D" }}>
          {Object.entries({
            Name: name,
            Contact: contact,
            "Business email": companyMail,
            Address: address,
            chapter: user.chapter,
          }).map((item, idx) => {
            if (!item[1]) {
              return null;
            }
            return (
              <Box
                key={idx}
                sx={{
                  color: "black",
                }}
              >
                <Typography fontSize={"12px"} fontWeight={"700"}>
                  {item[0]}
                </Typography>
                <Typography
                  fontSize={"20px"}
                  fontWeight={"600"}
                  marginTop={"4px"}
                >
                  {item[1]}
                </Typography>
                {idx < 3 && (
                  <Box
                    flex={1}
                    mx={"8px"}
                    height={"1px"}
                    my="16px"
                    sx={{
                      background:
                        "linear-gradient(90deg, rgba(205, 123, 255, 0.3) 0%, #A04AD4 49.52%, rgba(205, 123, 255, 0.3) 99.04%)",
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Business Details Section */}
      <Box sx={{ mt: "32px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={"24px"}
        >
          <Typography fontSize={"20px"} fontWeight={"500"}>
            Business Details
          </Typography>

          <IconButton
            size="small"
            onClick={() => setBusinessDetailsOpen(!businessDetailsOpen)}
          >
            {businessDetailsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
        <Collapse in={businessDetailsOpen}>
          <Stack mt={2} sx={{ p: "36px 24px", bgcolor: "#CD7BFF4D" }}>
            {(() => {
              const businessFields = {
                "Business Category": businessCategory,
                Designation: designation,
                "Current Stage": currentStage,
                "Community Goal": communityGoal,
                "Interested Events": interestedEvents,
                facebook: user.facebook,
                instagram: user.instagram,
              };

              const hasBusinessData =
                Object.values(businessFields).some((value) => value) ||
                businessLogo;

              if (!hasBusinessData) {
                return (
                  <Typography
                    fontSize={"16px"}
                    fontWeight={"500"}
                    color="text.secondary"
                    textAlign="center"
                    py={2}
                  >
                    Complete your profile to see the details.
                  </Typography>
                );
              }

              return (
                <>
                  {!profileComplete && (
                    <IconButton
                      size="small"
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                      onClick={() => navigate("/user/complete-profile")}
                    >
                      <BorderColorOutlinedIcon sx={{ color: "text.primary" }} />
                    </IconButton>
                  )}
                  {businessLogo && (
                    <Box
                      sx={{
                        mb: 3,
                        mx: "auto",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        bgcolor: "white",
                        justifyContent: "center",
                        p: 1,
                        width: "max-content",
                      }}
                    >
                      <Box>
                        <Box
                          component="img"
                          src={businessLogo}
                          alt="Business Logo"
                          sx={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                  {Object.entries(businessFields).map((item, idx) => {
                    if (!item[1]) {
                      return null;
                    }

                    const isLast =
                      idx ===
                      Object.entries(businessFields).filter(
                        ([, value]) => value
                      ).length -
                        1;

                    return (
                      <Box key={idx} sx={{ color: "black" }}>
                        <Typography fontSize={"12px"} fontWeight={"700"}>
                          {item[0]}
                        </Typography>
                        <Typography
                          fontSize={"20px"}
                          fontWeight={"600"}
                          marginTop={"4px"}
                        >
                          {item[1]}
                        </Typography>
                        {!isLast && (
                          <Box
                            flex={1}
                            mx={"8px"}
                            height={"1px"}
                            my="16px"
                            sx={{
                              background:
                                "linear-gradient(90deg, rgba(205, 123, 255, 0.3) 0%, #A04AD4 49.52%, rgba(205, 123, 255, 0.3) 99.04%)",
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </>
              );
            })()}
          </Stack>
        </Collapse>
      </Box>

      {/* Become a Webn Member Section */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box
          sx={{
            mt: "32px",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => navigate("/user/webn-membership")}
        >
          <Stack direction="row" sx={{ height: "160px" }}>
            {/* Left side - Text content */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "rgba(205, 123, 255, 0.1)",
                p: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: `1px solid ${theme.palette.primary.main}`,
                borderRight: "none",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                    fontSize: "20px",
                    lineHeight: "120%",
                    color: "text.primary",
                    mb: 0.5,
                  }}
                >
                  Become a Webn Member
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "10px",
                    color: theme.palette.text.secondary,
                    mb: 1,
                  }}
                >
                  T&C Applied
                </Typography>
              </Box>
              <ArrowRight size={30} />
            </Box>
            {/* Right side - Image */}
            <Box
              sx={{
                width: "50%",
                backgroundImage: `url(${foundation})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: `1px solid ${theme.palette.primary.main}`,
                borderLeft: "none",
              }}
            />
          </Stack>
        </Box>
      </AnimateOnScroll>

      {/* Stars Section */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Stack
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          mt={"50px"}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            p={"18px 24px"}
            gap={1}
            bgcolor="rgba(37, 37, 37, 1)"
            flex={1}
            color={"white"}
            letterSpacing={"-3%"}
            height={"100px"}
          >
            <Typography variant="h5">{totalStars}</Typography>
            <Typography variant="h5">Total stars</Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            p={"18px 20px"}
            gap={1}
            color={"white"}
            bgcolor={theme.palette.text.secondary}
            flex={1}
            height={"100px"}
            letterSpacing={"-3%"}
          >
            <Typography variant="h5">{redeemedStars}</Typography>
            <Typography variant="h5">Stars redeemed</Typography>
          </Box>
        </Stack>
      </AnimateOnScroll>

      {/* Active Learning */}
      <Box>
        <ActiveLearning />
      </Box>

      {/* Offers Section */}
      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Stack spacing={2} mt={"50px"}>
          <Typography fontSize={"20px"} fontWeight={"500"} pl={"22px"}>
            Offers
          </Typography>
          <Box
            sx={{
              border: `2px solid ${theme.palette.primary.main}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              position={"absolute"}
              zIndex={2}
              sx={{
                width: "80%",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                textAlign: "center",
                padding: "0 0px",
              }}
            >
              <Typography fontSize={"22px"} fontWeight={"700"}>
                Offers are on their way! 🚀
              </Typography>
              <Typography fontSize={"18px"} fontWeight={"500"}>
                Stack up your stars now, so you’re ready the moment they go
                live.
              </Typography>
            </Box>
            <Grid container sx={{ filter: "blur(5px)" }}>
              {offers.map((offer, idx) => (
                <Grid size={6} key={idx}>
                  <Box
                    sx={{
                      height: "100%",
                      p: 3,
                      border: `2px solid ${theme.palette.primary.main}`,
                      bgcolor: offer.bgcolor,
                      color:
                        // offer.bgcolor === "rgba(150, 255, 67, 1)"
                        "black",
                      // : "white",
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: "-3%",
                    }}
                  >
                    <Box
                      // component="img"
                      // src={offer.img}
                      // alt="image"
                      sx={{
                        bgcolor: "#D9D9D9",
                        zIndex: 0,
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    <Box>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"space-between"}
                        alignContent={"space-between"}
                      >
                        <Typography variant="h5" fontWeight="bold" mt={3}>
                          {offer.title}
                        </Typography>
                        <Box>
                          <Typography variant="body2" mt={2} fontSize={14}>
                            {offer.text}
                          </Typography>
                          <Typography
                            fontWeight={700}
                            fontSize={"16px"}
                            sx={{ mt: "20px" }}
                          >
                            {offer.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </AnimateOnScroll>

      {/* Badges Section */}
      {/* <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box mt={"50px"}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography ml={3} variant="h5">
              Badges
            </Typography>
            <IconButton size="small" onClick={() => setBadgesOpen(!badgesOpen)}>
              {badgesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Collapse in={badgesOpen}>
            <Stack
              direction="row"
              spacing={"12px"}
              mt={"10px"}
              p={"32px 36px"}
              bgcolor={"#CD7BFF4D"}
            >
              <Badge title="Microfinance Star" image={badge1} progress={100} />
              <Badge
                title="Client Relationship Master"
                image={badge2}
                progress={50}
              />
            </Stack>
          </Collapse>
        </Box>
      </AnimateOnScroll>

      <AnimateOnScroll
        variants={fadeInUp}
        transition={baseTransition}
        amount={0.3}
      >
        <Box mt={"50px"}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography ml={3} variant="h5">
              Certificates
            </Typography>
            <IconButton
              size="small"
              onClick={() => setCertificatesOpen(!certificatesOpen)}
            >
              {certificatesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Collapse in={certificatesOpen}>
            <Box
              mt={2}
              sx={{
                // bgcolor: theme.palette.background.paper,
                bgcolor: "#CD7BFF4D",
                p: "24px 12px",
              }}
            >
              <Certificate recipientName={name ?? ""} />
            </Box>
          </Collapse>
        </Box>
      </AnimateOnScroll> */}
    </Box>
  );
};

export default ProfileLayout;
