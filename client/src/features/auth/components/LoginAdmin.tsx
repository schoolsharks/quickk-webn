import { useState } from "react";
import GlobalButton from "../../../components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";
import { Box, Stack, TextField, Typography, Alert, Button } from "@mui/material";
import { useLoginAdminMutation } from "../../admin/service/adminApi";
import logo from "../../../assets/images/header/logo.png";

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
        navigate("/admin/impact-dashboard");
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

  if (isAuthenticated && role === "ADMIN") {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: "#0E0E0E",
      }}
    >
      <Box
        sx={{
          bgcolor: "#181818",
          px: 6,
          py: 5,
          minWidth: 400,
          maxWidth: 620,
          width: "100%",
          boxShadow: "0 8px 32px 0 rgba(150, 255, 67, 0.2)", 
          border: "1.5px solid #232323",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Logo */}
        <Box sx={{ p: "30px", mx: "auto", width: "max-content" }}>
          <Box component={"img"} width={"84px"} src={logo} alt="" />
        </Box>

        <Typography
          fontWeight={700}
          fontSize="2rem"
          color="#fff"
          mb={1}
          textAlign="center"
          letterSpacing={1}
        >
          Admin Login
        </Typography>
        <Typography fontSize="1rem" color="#bdbdbd" mb={3} textAlign="center">
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

        <Stack gap={3} sx={{ width: "100%" }}>
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
              },
            }}
          />
        </Stack>

        <GlobalButton
          onClick={handleLogin}
          disabled={isLoading}
          sx={{
            mt: 4,
            width: "100%",
            fontWeight: 600,
            fontSize: "1.1rem",
            bgcolor: "#7ED957", // softer green
            color: "#181818",
            borderRadius: 2,
            boxShadow: "0 2px 8px 0 rgba(126,217,87,0.10)", // match button shadow
            "&:hover": {
              bgcolor: "#6FC24A", // slightly darker on hover
            },
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </GlobalButton>

        {/* Signup Section */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ mt: 3, width: "100%" }}
        >
          <Typography color="#bdbdbd" fontSize="1rem">
            Don't have an account?
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSignup}
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
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginAdmin;
