import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import { resetOnboarding } from "../api/onboardingSlice";
import GreenButton from "../../../components/ui/GreenButton";
import CheckCircle from "../../../components/ui/checkCircle";

const OnboardingSuccess: React.FC = () => {
  const dispatch = useDispatch();
  const { companyInfo, adminInfo, selectedFeatures } = useSelector(
    (state: RootState) => state.onboarding
  );

  console.log(companyInfo);

  const handleContactUs = () => {
    dispatch(resetOnboarding());
    window.open("https://calendly.com/anuj-schoolsharks/30min", "_blank");
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 2, mx: "auto" }}>
          <CheckCircle width={"100px"} height={"100px"} />
          <Typography
            variant="h4"
            color="white"
            sx={{ mb: 4, mt: 1 }}
            textAlign="center"
            maxWidth={"400px"}
          >
            Your request is currently under review. Our team will contact you
            within 4–5 business days regarding the next steps.
          </Typography>
        </Box>

        <Card
          sx={{
            width: "max-content",
            backgroundColor: "#333",
            color: "white",
            mb: 4,
            border: "1px solid #444",
            borderRadius: 0,
            textAlign: "center",
            mx: "auto",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              Account Summary
            </Typography>

            <Box sx={{ textAlign: "left", mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Company:</strong> {companyInfo.companyName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Company Code:</strong> {companyInfo.companyCode}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Admin:</strong> {adminInfo.adminName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> {adminInfo.adminEmail}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Selected Features:</strong>{" "}
                {selectedFeatures.join(", ")} .
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <GreenButton onClick={handleContactUs}>Contact Us</GreenButton>
      </Box>
    </Box>
  );
};

export default OnboardingSuccess;
