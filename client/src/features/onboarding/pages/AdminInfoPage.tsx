import React, { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import {
  setAdminInfo,
  setCompanyInfo,
  setCurrentStep,
} from "../api/onboardingSlice";
import StepIndicator from "../components/StepIndicator";
import FormBuilder, { FieldConfig } from "../../../components/ui/FromBuilder";
import GreenButton from "../../../components/ui/GreenButton";
import { useNavigate } from "react-router-dom";
import { useCheckAdminEmailExistsMutation } from "../../admin/service/adminApi";
import AnimateOnState from "../../../animation/AnimateOnState";
import { textVibrateVariants } from "../../../animation/variants/textVibrate";
import { baseTransition } from "../../../animation/transitions/baseTransition";

const AdminInfoPage: React.FC = () => {
  const dispatch = useDispatch();
  const { adminInfo, companyInfo } = useSelector(
    (state: RootState) => state.onboarding
  );
  const [CheckAdminEmailExists] = useCheckAdminEmailExistsMutation();
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/admin/login");
  };
  const [emailExists, setEmailExists] = useState(false);

  // Flatten the form data for FormBuilder
  const [formData, setFormData] = useState({
    companyName: companyInfo?.companyName || "",
    adminName: adminInfo?.adminName || "",
    adminEmail: adminInfo?.adminEmail || "",
  });

  const steps = ["Admin Information", "Select Features", "Email Verification"];

  const fields: FieldConfig[] = [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      required: true,
      placeholder: "Enter your company name",
    },
    {
      name: "adminName",
      label: "Admin Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
    },
    {
      name: "adminEmail",
      label: "Admin Email",
      type: "text",
      required: true,
      placeholder: "Enter your email address",
    },
  ];

  // Update flat form data and keep nested state for redux
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleNext = () => {
    CheckAdminEmailExists({ adminEmail: formData.adminEmail })
      .unwrap()
      .then((response: any) => {
        if (response?.success) {
          dispatch(
            setAdminInfo({
              adminId: "",
              adminName: formData.adminName,
              adminEmail: formData.adminEmail,
            })
          );
          dispatch(
            setCompanyInfo({
              companyName: formData.companyName,
              companyCode: "",
            })
          );
          dispatch(setCurrentStep(2));
          setEmailExists(false);
        }
      })
      .catch((error: any) => {
        setEmailExists(true);
        console.log("Email already exists : ", error);
      });
  };

  const isFormValid =
    formData.adminName.trim() &&
    formData.adminEmail.trim() &&
    formData.companyName.trim();

  return (
    <Box height={""}>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        <StepIndicator currentStep={1} totalSteps={3} steps={steps} />

        <Box sx={{ mb: 1 }} textAlign={"center"}>
          <Typography variant="h4" color="white" sx={{ mb: 2 }}>
            You'll be the root administrator for your company
          </Typography>
        </Box>

        <FormBuilder
          fields={fields}
          data={formData}
          onChange={handleFieldChange}
        />

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <AnimateOnState
            variants={textVibrateVariants}
            transition={baseTransition}
            animateKey={emailExists ? `vibrate-${Date.now()}` : undefined} // force re-render when true
          >
            <Stack
              direction="row"
              alignItems="center"
              // justifyContent="center"
              spacing={1}
              sx={{ width: "max-content" }}
            >
              <Typography
                color={emailExists ? "error" : "#bdbdbd"}
                fontSize="1rem"
              >
                {emailExists
                  ? "Email already exists. Log in now."
                  : "Already have an account?"}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                onClick={handleLogin}
                sx={{
                  borderColor: "#7ED957",
                  color: "#7ED957",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  px: 2,
                  py: 0.5,
                  "&:hover": {
                    bgcolor: "#232323",
                    borderColor: "#6FC24A",
                    color: "#6FC24A",
                  },
                }}
              >
                Log In
              </Button>
            </Stack>
          </AnimateOnState>
          <GreenButton onClick={handleNext} disabled={!isFormValid}>
            Next Step
          </GreenButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminInfoPage;
