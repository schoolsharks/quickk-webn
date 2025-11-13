import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Alert,
  useTheme,
} from "@mui/material";
import WebnLogo from "../../../assets/images/header/logo.webp";
import GoWomaniaLogo from "../../../assets/images/header/goWomania.webp";
import GlobalButton from "../../../components/ui/button";

interface EmailInputScreenProps {
  onSendOtp: (email: string) => void;
  onSignup: () => void;
  isLoading: boolean;
  error: string;
}

const EmailInputScreen = ({
  onSendOtp,
  onSignup,
  isLoading,
  error,
}: EmailInputScreenProps) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (email.trim()) {
      onSendOtp(email.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Box
      p={"40px 24px 30px 24px"}
      sx={{
        color: "#fff",
        minHeight: window.innerHeight,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Section */}
      <Box display={"flex"} flexDirection={"column"} gap={"60px"}>
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

        <Box mb={"20px"}>
          <Typography
            fontWeight="700"
            fontSize={"25px"}
            lineHeight={"30px"}
            mb={"10px"}
            color={theme.palette.text.primary}
          >
            Welcome to the<br/> GoWomania Community 🌟
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

      {/* Content Section - Takes remaining space */}
      <Box
        sx={{ 
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          minHeight: "200px" // Ensures minimum space for content
        }}
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
        <Box
          mt={2}
          gap={"25px"}
          display="flex"
          flexDirection="column"
          color={"black"}
        >
          <Typography variant="h4" color="primary" fontSize={"14px"}>
            Login
          </Typography>
          <Stack gap={"30px"}>
            <TextField
              placeholder="Business email address*"
              variant="standard"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: "20px",
                },
              }}
            />
          </Stack>

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

      {/* Fixed Button Section */}
      <Box sx={{ mt: "60px", flexShrink: 0 }}>
        <GlobalButton
          onClick={handleSubmit}
          disabled={isLoading || !email.trim()}
          sx={{
            bgcolor: "#F0D7FF",
            color: "black",
          }}
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </GlobalButton>
      </Box>
    </Box>
  );
};

export default EmailInputScreen;
