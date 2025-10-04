// features/onboarding/pages/FeatureSelectionPage.tsx (Updated)
import React from "react";
import { Box, Typography, Grid, Alert, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import {
  toggleFeature,
  setCurrentStep,
  setCompanyInfo,
  setSelectedFeatures,
  setEmailExists,
  setAdminInfo,
} from "../api/onboardingSlice";
import {
  useGetAllFeaturesQuery,
  useCompleteOnboardingMutation,
} from "../api/onboardingApi";
import StepIndicator from "../components/StepIndicator";
import FeatureCard from "../components/FeatureCard";
import GreenButton from "../../../components/ui/GreenButton";

const FeatureSelectionPage: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedFeatures, companyInfo, adminInfo } = useSelector(
    (state: RootState) => state.onboarding
  );
  const {
    data: featuresData,
    isLoading: featuresLoading,
    error: featuresError,
  } = useGetAllFeaturesQuery();
  const [
    completeOnboarding,
    { isLoading: onboardingLoading, error: onboardingError },
  ] = useCompleteOnboardingMutation();

  const steps = ["Admin Information", "Select Features", "Email Verification"];

  const handleFeatureToggle = (featureId: string) => {
    dispatch(toggleFeature(featureId));
  };

  const handleBack = () => {
    dispatch(setCurrentStep(1));
  };

  const handleComplete = async () => {
    await completeOnboarding({
      companyName: companyInfo.companyName,
      adminName: adminInfo.adminName,
      adminEmail: adminInfo.adminEmail,
      selectedFeatures,
    })
      .unwrap()
      .then((result) => {
        dispatch(
          setCompanyInfo({
            companyName: result?.data.company.companyName,
            companyCode: result?.data.company.companyCode,
          })
        );
        dispatch(
          setAdminInfo({
            adminId: result?.data.admin._id,
            adminName: adminInfo.adminName,
            adminEmail: adminInfo.adminEmail,
          })
        );
        dispatch(
          setSelectedFeatures(
            result?.data.features.features.map((f: any) => f.name)
          )
        );
        dispatch(setCurrentStep(3));
      })
      .catch((error: any) => {
        dispatch(setEmailExists(true));
        dispatch(setCurrentStep(3));
        console.log("error in onboarding", error);
      });
  };

  const isFormValid = selectedFeatures.length > 0;

  if (featuresLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "primary.main", mb: 2 }} />
          <Typography color="white">Loading features...</Typography>
        </Box>
      </Box>
    );
  }

  if (featuresError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography color="red" variant="h6">
            Error loading features. Please try again.
          </Typography>
          <GreenButton onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            Retry
          </GreenButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <StepIndicator currentStep={2} totalSteps={3} steps={steps} />

        <Box sx={{ mb: 1 }} textAlign={"center"}>
          {/* <Typography
            variant="h3"
            color="primary.main"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Choose Your Features
          </Typography> */}
          <Typography variant="h4" color="white" sx={{ mb: 2 }}>
            Select the features you want to enable for your company.
          </Typography>
        </Box>

        {onboardingError && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: "#333",
              color: "white",
              borderRadius: 0,
              "& .MuiAlert-icon": {
                color: "#ff4444",
              },
            }}
          >
            Setup failed. Please try again.
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {featuresData?.data.map((feature) => (
            <Grid size={{ xs: 12, md: 6 }} key={feature._id}>
              <FeatureCard
                feature={feature}
                isSelected={selectedFeatures.includes(feature._id)}
                onToggle={handleFeatureToggle}
              />
            </Grid>
          ))}
        </Grid>

        {/* {selectedFeatures.length === 0 && (
          <Alert
            severity="info"
            sx={{
              mb: 3,
              backgroundColor: "#333",
              color: "white",
              borderRadius: 0,
              "& .MuiAlert-icon": {
                color: "primary.main",
              },
            }}
          >
            Please select at least one feature to continue
          </Alert>
        )} */}

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <GreenButton onClick={handleBack} disabled={onboardingLoading}>
            Back
          </GreenButton>
          <GreenButton
            onClick={handleComplete}
            disabled={!isFormValid || onboardingLoading}
          >
            {onboardingLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} sx={{ color: "black" }} />
                Setting up...
              </Box>
            ) : (
              "Complete Setup"
            )}
          </GreenButton>
        </Box>
      </Box>
    </Box>
  );
};

export default FeatureSelectionPage;
