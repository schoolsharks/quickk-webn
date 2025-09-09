import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { RootState } from "../../../app/store";
import {
  useSendOtpMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
  useSignupUserMutation,
} from "../../user/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Import the new screen components
import EmailInputScreen from "./EmailInputScreen";
import OtpVerificationScreen from "./OtpVerificationScreen";
import SignupScreen, { SignupData } from "./SignupScreen";

type LoginStep = "email" | "otp" | "signup";

const Login = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // API mutations
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [resendOtp, { isLoading: isResendingOtp }] = useResendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [signupUser, { isLoading: isSigningUp }] = useSignupUserMutation();

  // Handle send OTP
  const handleSendOtp = async (emailAddress: string) => {
    try {
      setError("");
      setEmail(emailAddress);
      await sendOtp({ companyMail: emailAddress }).unwrap();
      setCurrentStep("otp");
    } catch (err) {
      const fetchError = err as FetchBaseQueryError;
      const message = (fetchError.data as any)?.message || "Failed to send OTP";
      setError(message);

      // If user not found, they can signup
      if (message.includes("User not found")) {
        // Don't navigate automatically, let user choose
      }
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      setError("");
      await resendOtp({ companyMail: email }).unwrap();
    } catch (err) {
      const fetchError = err as FetchBaseQueryError;
      const message =
        (fetchError.data as any)?.message || "Failed to resend OTP";
      setError(message);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async (otpCode: string) => {
    try {
      setError("");
      const result = await verifyOtp({
        companyMail: email,
        otp: otpCode,
      }).unwrap();

      if (result) {
        // Check if this is from a new signup
        const showStarsPopup = localStorage.getItem("showStarsPopup");
        if (showStarsPopup) {
          localStorage.removeItem("showStarsPopup");
          localStorage.setItem("showStarsPopup", "true");
        }
        navigate("/user/mode-selection");
      }
    } catch (err) {
      const fetchError = err as FetchBaseQueryError;
      const message = (fetchError.data as any)?.message || "Invalid OTP";
      setError(message);
    }
  };

  // Handle signup
  const handleSignup = async (signupData: SignupData, ref?: string | null) => {
    try {
      setError("");
      const result = await signupUser({signupData, ref}).unwrap();

      if (result) {
        setEmail(signupData.companyMail);
        setCurrentStep("otp");
        localStorage.setItem("showStarsPopup", "true");
      }
    } catch (err) {
      const fetchError = err as FetchBaseQueryError;
      const message = (fetchError.data as any)?.message || "Signup failed";
      setError(message);
    }
  };

  // Handle navigation to signup
  const handleGoToSignup = () => {
    setCurrentStep("signup");
    setError("");
  };

  // Redirect if already authenticated
  if (isAuthenticated && role === "USER") {
    return <Navigate to="/user/dashboard" />;
  }

  // Render appropriate screen based on current step
  switch (currentStep) {
    case "email":
      return (
        <EmailInputScreen
          onSendOtp={handleSendOtp}
          onSignup={handleGoToSignup}
          isLoading={isSendingOtp}
          error={error}
        />
      );

    case "otp":
      return (
        <OtpVerificationScreen
          email={email}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
          isLoading={isVerifyingOtp || isResendingOtp}
          error={error}
        />
      );

    case "signup":
      return (
        <SignupScreen
          onSignup={handleSignup}
          isLoading={isSigningUp}
          error={error}
        />
      );

    default:
      return null;
  }
};

export default Login;
