import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Alert,
  Button,
  useTheme,
} from "@mui/material";
import { useLoginAdminMutation } from "../../admin/service/adminApi";
import logo from "../../../assets/images/header/logo.webp";
import GreenButton from "../../../components/ui/GreenButton";
import { Roles } from "../authSlice";

const LoginAdmin = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    adminEmail: "",
    companyCode: "",
  });

  const navigate = useNavigate();

  const [login, { isLoading, isError, error }] = useLoginAdminMutation();

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
      setLoginError("");
      const result = await login(formData).unwrap();
      if (result) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const fetchError = err as FetchBaseQueryError;
      const message =
        (fetchError.data as any)?.message ||
        "Invalid credentials. Please try again.";
      setLoginError(message);
    }
  };

  const handleSignup = () => {
    navigate("/admin/onboarding");
  };
  const theme = useTheme();
  
  // Redirect if already authenticated as ADMIN or SUPER_ADMIN
  if (isAuthenticated && (role === Roles.ADMIN || role === Roles.SUPER_ADMIN)) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: "#F7F0FB",
      }}
    >
      <Box
        sx={{
          bgcolor: "#CD7BFF4D",
          px: 6,
          py: 5,
          minWidth: 400,
          maxWidth: 620,
          width: "100%",
          border: `2px solid ${theme.palette.primary.main}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          color: "black",
        }}
      >
        {/* Logo */}
        <Box sx={{ p: "30px", mx: "auto", width: "max-content" }}>
          <Box component={"img"} width={"84px"} src={logo} alt="" />
        </Box>

        <Typography
          fontWeight={700}
          fontSize="2rem"
          mb={1}
          textAlign="center"
          letterSpacing={1}
        >
          Admin Login
        </Typography>
        <Typography fontSize="1rem" mb={3} textAlign="center">
          Welcome back, Admin! Please sign in to continue.
        </Typography>

        {(isError || loginError) && (
          <Alert
            severity="error"
            sx={{
              bgcolor: "rgba(211, 47, 47, 0.1)",
              color: "#f44336",
              mb: 2,
              width: "100%",
            }}
          >
            {loginError ||
              ((error as FetchBaseQueryError)?.data as any)?.message ||
              "Login failed. Please check your credentials."}
          </Alert>
        )}

        <Stack gap={3} sx={{ width: "100%" }} mb={4}>
          <TextField
            name="adminEmail"
            placeholder="Admin email address*"
            variant="standard"
            fullWidth
            value={formData.adminEmail}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "0",
                color: theme.palette.primary.main,
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
            onKeyDown={handleKeyDown}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "0",
                color: theme.palette.primary.main,
              },
            }}
          />
        </Stack>

        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <GreenButton
            onClick={handleLogin}
            disabled={isLoading}
            sx={{ width: "150px" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </GreenButton>
          {/* Signup Section */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Typography color="black" fontSize="1rem">
              Don't have an account?
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSignup}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                py: 0.5,
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginAdmin;
