import { Box, Stack } from "@mui/material";
import { useState } from "react";
import Onboardinghead from "../../assets/images/Onboardinghead.png";
import OnboardingInstruction from "../../features/auth/components/OnboardingInstruction";
import GlobalButton from "../../components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

// Content for each step
const steps = [
  {
    title: "Micro Learning",
    subtitle: "5 minutes everyday",
    description:
      "Master BFSI concepts through bite-sized lessons anytime, anywhere. Stay ahead in your career with quick, engaging learning.",
  },
  {
    title: "Challenges",
    subtitle: "Test & Improve",
    description:
      "Put your skills to the test with fun, interactive challenges. Compete, earn coins, and sharpen your expertise.",
  },
  {
    title: "Rewards",
    subtitle: "Learn & Earn",
    description:
      "Turn your learning into real rewards! Earn coins, win raffles, and invest in mutual funds for future growth.",
  },
];

const OnboardingLayout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      navigate("/user/login");
    }
  };

  if (isAuthenticated && role === "USER") {
    return <Navigate to="/user/dashboard" />;
  }
  return (
    <Box
     
      sx={{
        overflowX: "hidden",
        bgcolor: "#0E0E0E",
        color: "#fff",
        minHeight: window.innerHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header Image */}
      <Box
        component="img"
        src={Onboardinghead}
        alt="Onboarding"
        sx={{ width: "740px", height: "300px", objectFit: "cover" }}
      />

      {/* Middle Content */}
      <OnboardingInstruction steps={steps} activeStep={activeStep} />

      {/* Progress Indicators */}
      <Box mt={"auto"} px={"20px"} sx={{ width: "100%" }}>
        <Stack
          mt={"auto"}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          px={"22px"}
        >
          {[...Array(steps.length)].map((_, index) => (
            <>
              <Box
                key={index}
                sx={{
                  width: 25,
                  height: 25,
                  border: "1px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  opacity: activeStep >= index ? 1 : 0.5,
                  justifyContent: "center",
                  color: "#fff",
                  borderRadius: "4px",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                {index + 1}
              </Box>
              {index < steps.length - 1 && (
                <Box
                  key={index + steps.length}
                  sx={{
                    flex: "1",
                    height: "1px",
                    bgcolor: "#fff",
                    opacity: activeStep > index ? 1 : 0.5,
                    mx: "8px",
                  }}
                />
              )}
            </>
          ))}
        </Stack>

        {/* Continue Button */}
        <Box mt={"24px"} mb={"24px"}>
          <GlobalButton disabled={false} onClick={handleNext}>
            Continue
          </GlobalButton>
        </Box>
      </Box>
    </Box>
  );
};

export default OnboardingLayout;
