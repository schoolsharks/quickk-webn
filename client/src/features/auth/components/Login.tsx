import { useState } from "react";
import { Box, Stack, TextField, Typography, Alert } from "@mui/material";
import Onboardinghead from "../../../assets/images/Onboardinghead.png";
import GlobalButton from "../../../components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { useLoginUserMutation } from "../../user/userApi";

const Login = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    companyMail: "",
    companyCode: "",
  });

  const navigate = useNavigate();

  const [login, { isLoading, isError, error }] = useLoginUserMutation();

  const [loginError, setLoginError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };


  const handleLogin = async () => {
    try {
      setLoginError(""); // Reset previous error
      const result = await login(formData).unwrap();

      // Only navigate on successful login
      if (result) {
        navigate("/user/avatars");
      }
    } catch (err) {
      const fetchError = err as FetchBaseQueryError;
      const message =
        (fetchError.data as any)?.message ||
        "Invalid credentials. Please try again.";
      setLoginError(message);
    }
  };

  // Redirect only if already authenticated
  if (isAuthenticated && role === "USER") {
    return <Navigate to="/user/dashboard" />;
  }

  return (
    <Box
      overflow={"hidden"}
      sx={{
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
      <Box px={"20px"} sx={{ width: "100%" }}>
        {/* Form Content */}
        <Box
          mt={"30px"}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          bgcolor="#0E0E0E"
        >
          <Typography
            fontWeight="700"
            fontSize={"25px"}
            lineHeight={"24px"}
            color="#FFFFFF"
            mb={2}
          >
            Login
          </Typography>

          {/* Show login error if any */}
          {(isError || loginError) && (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(211, 47, 47, 0.1)",
                color: "#f44336",
              }}
            >
              {loginError ||
                ((error as FetchBaseQueryError)?.data as any)?.message ||
                "Login failed. Please check your credentials."}
            </Alert>
          )}

          <Stack gap={"40px"} mt={"30px"}>
            <TextField
              name="companyMail"
              placeholder="Company email address*"
              variant="standard"
              fullWidth
              value={formData.companyMail}
              onChange={handleChange}
              sx={{
                input: { color: "#FFFFFF" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#FFFFFF",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "#FFFFFF",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#FFFFFF",
                },
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                  fontSize: "20px",
                },
              }}
            />
            <TextField
              name="companyCode"
              placeholder="Company code*"
              variant="standard"
              fullWidth
              value={formData.companyCode}
              onChange={handleChange}
              sx={{
                input: { color: "#FFFFFF" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#FFFFFF",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "#FFFFFF",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#FFFFFF",
                },
                "& .MuiInputLabel-root": {
                  color: "#FFFFFF",
                  fontSize: "20px",
                },
              }}
            />
          </Stack>
        </Box>

        <GlobalButton
          onClick={handleLogin}
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          sx={{ mt: "30px", mb: "30px" }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </GlobalButton>
      </Box>
    </Box>
  );
};

export default Login;
