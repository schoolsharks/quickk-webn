import React, { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../app/store";
import { setCurrentStep } from "../api/onboardingSlice";
import StepIndicator from "../components/StepIndicator";
import FormBuilder, { FieldConfig } from "../../../components/ui/FromBuilder";
import GreenButton from "../../../components/ui/GreenButton";
// import { useNavigate } from "react-router-dom";
import {
  useResendAdminOtpMutation,
  useVerifyAdminOtpMutation,
} from "../../admin/service/adminApi";

const EmailVerificationPage: React.FC = () => {
  const dispatch = useDispatch();
  const { adminInfo, emailExists } = useSelector(
    (state: RootState) => state.onboarding
  );
  // const navigate = useNavigate();
  const [VerifyAdminOtp] = useVerifyAdminOtpMutation();
  const [ResendAdminOtp] = useResendAdminOtpMutation();

  const [formData, setFormData] = useState({
    otp: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const steps = ["Admin Information", "Email Verification", "Select Features"];

  const fields: FieldConfig[] = [
    {
      name: "otp",
      label: "Enter OTP",
      type: "text",
      required: true,
      placeholder: "Enter the OTP sent to your email",
    },
  ];

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    setError(null);
  };

  const handleVerify = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await VerifyAdminOtp({
        adminId: adminInfo.adminId,
        otp: formData.otp,
      }).unwrap();
      if (response?.success) {
        dispatch(setCurrentStep(4));
      }
    } catch (err: any) {
      setError(err?.message || "Invalid OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await ResendAdminOtp({ adminId: adminInfo.adminId }).unwrap();
      setSnackbarOpen(true);
    } catch (err: any) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ maxWidth: 400, mx: "auto" }}>
        <StepIndicator currentStep={3} totalSteps={3} steps={steps} />

        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Typography variant="h4" color="white" sx={{ mb: 1 }}>
            Email Verification
          </Typography>
          <Typography color="white" sx={{ mb: 2 }}>
            {emailExists
              ? "This email is already registered."
              : `Enter the OTP sent to ${adminInfo.adminEmail}`}
          </Typography>
        </Box>

        {/* {!emailExists && ( */}
          <FormBuilder
            fields={fields}
            data={formData}
            onChange={handleFieldChange}
          />
        {/* )} */}

        {error && (
          <Typography color="error" sx={{ mt: 1, mb: 1 }}>
            {error}
          </Typography>
        )}

        {/* {emailExists ? (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <GreenButton
              onClick={() => {
                navigate("/admin/login");
              }}
              disabled={submitting}
            >
              Login
            </GreenButton>
          </Box>
        ) : ( */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <GreenButton onClick={handleResend} disabled={submitting}>
              Resend OTP
            </GreenButton>
            <GreenButton
              onClick={handleVerify}
              disabled={submitting || !formData.otp.trim()}
            >
              Verify & Next
            </GreenButton>
          </Box>
        {/* )} */}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          OTP resent successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmailVerificationPage;
