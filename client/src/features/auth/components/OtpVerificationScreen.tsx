import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Alert,
  useTheme,
  TextField,
} from "@mui/material";
import WebnLogo from "../../../assets/images/header/logo.webp";
import GoWomaniaLogo from "../../../assets/images/header/goWomania.webp";
import GlobalButton from "../../../components/ui/button";

interface OtpVerificationScreenProps {
  email: string;
  onVerifyOtp: (otp: string) => void;
  onResendOtp: () => void;
  onSignup?: () => void;
  isLoading: boolean;
  error: string;
}

const OtpVerificationScreen = ({
  email,
  onVerifyOtp,
  onResendOtp,
  onSignup,
  isLoading,
  error,
}: OtpVerificationScreenProps) => {
  const theme = useTheme();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
    if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
      handleVerify();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join("");
    if (otpString.length === 4) {
      onVerifyOtp(otpString);
    }
  };

  const handleResend = () => {
    if (canResend) {
      onResendOtp();
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", ""]);
    }
  };

  return (
    <Box
      overflow={"hidden"}
      p={"40px 24px 20px 24px"}
      sx={{
        color: "#fff",
        minHeight: window.innerHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        {/* Header Image */}
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box
            component="img"
            src={GoWomaniaLogo}
            border={`2px solid ${theme.palette.primary.main}`}
            borderRadius={"50%"}
            alt=""
            sx={{ width: "50px", height: "50px", objectFit: "cover",padding:"2px" }}
          />
          <Box
            component="img"
            src={WebnLogo}
            border={`2px solid ${theme.palette.primary.main}`}
            borderRadius={"50%"}
            alt=""
            sx={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </Box>

        <Box mt={"40px"} mb={"10px"}>
          <Typography
            fontWeight="700"
            fontSize={"25px"}
            lineHeight={"30px"}
            mb={"10px"}
            color={theme.palette.text.primary}
          >
            Welcome to the
            <br />
            GoWomania Community 🌟
          </Typography>
          <Typography
            fontWeight="500"
            fontSize={"14px"}
            color="black"
            lineHeight={"18px"}
          >
            One community for all - From budding entrepreneurs to homepreneurs,
            from investors to job seekers — this is where growth journeys begin.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ width: "100%" }}
        display={"flex"}
        flexDirection={"column"}
        justifyContent="space-between"
      >
        <Box
          mt={"30px"}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          color={"black"}
        >
          {/* Show error if any */}
          {error && (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(211, 47, 47, 0.1)",
                color: "#f44336",
                mb: 2,
                borderRadius: "0px",
              }}
            >
              {error}
            </Alert>
          )}

          <Box mt={"30px"} mb={"20px"}>
            <Typography variant="h4" color="primary" fontSize={"14px"}>
              Login
            </Typography>
            <TextField
              variant="standard"
              fullWidth
              value={email}
              disabled
              sx={{
                mt: 4,
                mb: 3,
                "& .MuiInputLabel-root": {
                  fontSize: "20px",
                },
              }}
            />

            <Typography variant="h4" color="black" fontSize={"14px"} mb={2}>
              Enter OTP*
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-start"
              mb={3}
            >
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  variant="outlined"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderColor: "black",
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      borderRadius: "0px",
                      "& input": {
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                      },
                    },
                  }}
                />
              ))}
            </Stack>

            <Typography variant="body2" color="gray" fontSize="12px">
              {!canResend ? (
                `Didn't receive OTP? Resend in ${countdown}s`
              ) : (
                <>
                  Didn't receive OTP?{" "}
                  <span
                    style={{
                      color: theme.palette.primary.main,
                      cursor: "pointer",
                    }}
                    onClick={handleResend}
                  >
                    Resend
                  </span>
                </>
              )}
            </Typography>
            <Typography variant="body2" color="gray" fontSize="12px">
              Not a Member?{" "}
              <span
                style={{ color: theme.palette.primary.main, cursor: "pointer" }}
                onClick={onSignup}
              >
                Sign Up
              </span>
            </Typography>
          </Box>
        </Box>
      </Box>
      <GlobalButton
        onClick={handleVerify}
        disabled={isLoading || otp.some((digit) => digit === "")}
        sx={{
          bgcolor: "#F0D7FF",
          color: "black",
        }}
      >
        {isLoading ? "Verifying..." : "Login"}
      </GlobalButton>
    </Box>
  );
};

export default OtpVerificationScreen;
