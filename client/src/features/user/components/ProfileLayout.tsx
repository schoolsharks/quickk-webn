import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Collapse,
  Grid,
} from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Import your images
import badge1 from "../../../assets/images/user/MedalBlue.png";
import badge2 from "../../../assets/images/user/GoldMedal.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../theme/theme";
import ActiveLearning from "../../../components/ui/ActiveLearning";
import amajon from "../../../assets/images/user/amajon.png";
import starbucks from "../../../assets/images/user/starbucks.png";
import foundation from "../../../assets/images/user/foundation.png";
import watch from "../../../assets/images/user/watch.png";
import Badge from "../../../components/ui/badge";
import Certificate from "../../../components/ui/certificate";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import AnimateOnScroll from "../../../animation/AnimateOnScroll";
import { fadeInUp } from "../../../animation";
import { baseTransition } from "../../../animation/transitions/baseTransition";

const ProfileLayout = () => {
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [certificatesOpen, setCertificatesOpen] = useState(false);
  const navigate = useNavigate();
  const { totalStars, redeemedStars, name, address, contact, companyMail } =
    useSelector((state: RootState) => state.user);

  const navigateToHome = () => {
    navigate("/user/dashboard");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const offers = [
    {
      title: "20% on order above 2500Rs",
      subtitle: "1000 Points",
      img: amajon,
      bgcolor: "rgba(37, 37, 37, 1)",
    },
    {
      title: "10% off on Wednesdays",
      subtitle: "800 Points",
      img: starbucks,
      bgcolor: "background.paper",
    },
    {
      title: "Upto 30% Off On Insurance Premium",
      subtitle: "Unlocks at Level 2",
      img: foundation,
      bgcolor: "rgba(150, 255, 67, 1)",
    },
    {
      title: "5% off on Fitness tracker",
      subtitle: "Unlocks on Level 5",
      img: watch,
      bgcolor: "rgba(37, 37, 37, 1)",
    },
  ];

  return (
    <Box sx={{ pt: "50px" }}>
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
        <Typography
          variant="body1"
          sx={{ textDecoration: "underline" }}
          pl="52px"
        >
          Company - Quickk
          {/* add name of company here  */}
        </Typography>
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
          <IconButton size="small">
            <BorderColorOutlinedIcon sx={{ color: "text.primary" }} />
          </IconButton>
        </Stack>
        <Stack
          spacing={2}
          mt={2}
          sx={{ p: "36px 24px", bgcolor: "primary.main" }}
        >
          {[
            `Name - ${name}`,
            `Contact - ${contact}`,
            `Business email - ${companyMail}`,
            `Address - ${address}`,
          ].map((detail, idx) => (
            <Box
              key={idx}
              sx={{
                bgcolor: "background.paper",
                p: 1.5,
                color: "white",
              }}
            >
              <Typography fontSize={"14px"} fontWeight={"400"}>
                {detail}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

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
            letterSpacing={"-3%"}
            height={"100px"}
          >
            <Typography variant="h5">{totalStars}</Typography>
            <Typography variant="h5">Total stars</Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            p={"18px 24px"}
            gap={1}
            bgcolor={theme.palette.background.paper}
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
      <Box mt={"50px"}>
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
          <Grid container>
            {offers.map((offer, idx) => (
              <Grid size={6} key={idx}>
                <Box
                  sx={{
                    height: "100%",
                    p: 3,
                    bgcolor: offer.bgcolor,
                    color:
                      offer.bgcolor === "rgba(150, 255, 67, 1)"
                        ? "black"
                        : "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    lineHeight: "-3%",
                  }}
                >
                  <Box
                    component="img"
                    src={offer.img}
                    alt="image"
                    sx={{
                      zIndex: 0,
                      maxWidth: "88px",
                      maxHeight: "54px",
                    }}
                  />
                  <Box>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" mt={6}>
                        {offer.title}
                      </Typography>
                      <Typography
                        fontWeight={500}
                        fontSize={"16px"}
                        sx={{ textDecoration: "underline", mt: "20px" }}
                      >
                        {offer.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </AnimateOnScroll>

      {/* Badges Section */}
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
              bgcolor={theme.palette.background.paper}
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
      {/* Certificates Section */}
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
                bgcolor: theme.palette.background.paper,
                p: "24px 12px",
              }}
            >
              <Certificate recipientName="John Doe" />
            </Box>
          </Collapse>
        </Box>
      </AnimateOnScroll>
    </Box>
  );
};

export default ProfileLayout;
