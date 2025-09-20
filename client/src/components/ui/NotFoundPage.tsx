import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import { styled, keyframes } from "@mui/system";

const float = keyframes`
    0% { transform: translateY(0px);}
    50% { transform: translateY(-18px);}
    100% { transform: translateY(0px);}
`;

const AnimatedSVG = styled("svg")(({ theme }) => ({
  marginBottom: theme.spacing(4),
  animation: `${float} 2.5s ease-in-out infinite`,
}));

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
//   const location = useLocation();
//   const prevPath = location.state?.from || "/";

//   const handleGoBack = () => {
//     navigate(prevPath, { replace: true });
//   };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(150deg, #96FF45 0%, #4CAF50 50%)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      <AnimatedSVG width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#96FF45" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#grad)" />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          fontSize="64"
          fontWeight="bold"
          fill="#4CAF50"
          dy=".3em"
          style={{
            filter: "drop-shadow(0 2px 8px #fff8)",
            letterSpacing: "2px",
          }}
        >
          404
        </text>
      </AnimatedSVG>

      <Paper
        elevation={8}
        sx={{
          p: 4,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 4,
          textAlign: "center",
          mb: 4,
          backdropFilter: "blur(2px)",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Oops! Page Not Found
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
          The page you are looking for doesn&apos;t exist or an error occurred.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/admin/dashboard")}
          sx={{
            background: "linear-gradient(90deg, #96FF45 0%, #4CAF50 100%)",
            color: "#222",
            borderRadius: "32px",
            fontWeight: 600,
            px: 5,
            py: 1.5,
            boxShadow: "0 4px 24px #96FF4544",
            transition: "transform 0.2s, box-shadow 0.2s",
            mr: 2,
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 32px #96FF4588",
              background: "linear-gradient(90deg, #96FF45 0%, #4CAF50 100%)",
            },
          }}
        >
          Admin Dashboard
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/user/dashboard")}
          sx={{
            background: "linear-gradient(90deg, #96FF45 0%, #4CAF50 100%)",
            color: "#222",
            borderRadius: "32px",
            fontWeight: 600,
            px: 5,
            py: 1.5,
            boxShadow: "0 4px 24px #96FF4544",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 32px #96FF4588",
              background: "linear-gradient(90deg, #96FF45 0%, #4CAF50 100%)",
            },
          }}
        >
          User Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
