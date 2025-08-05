import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import { setCompanyInfo, setCurrentStep } from "../api/onboardingSlice";
import StepIndicator from "../components/StepIndicator";
import FormBuilder, { FieldConfig } from "../../../components/ui/FromBuilder";
import GreenButton from "../../../components/ui/GreenButton";

const CompanyInfoPage: React.FC = () => {
  const dispatch = useDispatch();
  const { companyInfo } = useSelector((state: RootState) => state.onboarding);
  const [formData, setFormData] = useState(companyInfo);

  const steps = ["Company Information", "Admin Information", "Select Features"];

  const fields: FieldConfig[] = [
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      required: true,
      placeholder: "Enter your company name",
    },
    {
      name: "companyCode",
      label: "Company Code",
      type: "text",
      required: true,
      placeholder: "Enter a unique company code",
    },
  ];

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleNext = () => {
    if (formData.companyName && formData.companyCode) {
      dispatch(setCompanyInfo(formData));
      dispatch(setCurrentStep(2));
    }
  };

  const isFormValid =
    formData.companyName.trim() && formData.companyCode.trim();

  return (
    <Box>
      <Box maxWidth={800} mx={"auto"}>
        <StepIndicator currentStep={1} totalSteps={3} steps={steps} />

        <Box sx={{ mb: 4 }} textAlign={"center"}>
          <Typography variant="h4" color="white" sx={{ mb: 4 }}>
            Let's set up your company profile to get started
          </Typography>
        </Box>

        <FormBuilder
          fields={fields}
          data={formData}
          onChange={handleFieldChange}
        />

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <GreenButton onClick={handleNext} disabled={!isFormValid}>
            Next Step
          </GreenButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyInfoPage;
