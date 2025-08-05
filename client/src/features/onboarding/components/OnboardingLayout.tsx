import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import logo from "../../../assets/images/header/logo.png";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title = "Welcome to Quickk",
  subtitle = "Let's get you started",
}) => {
  return (
    <Box sx={{ backgroundColor: "black"}}>
      <Grid container minHeight= "100vh" p={4}>
        {/* Header */}
        <Grid size={5} sx={{ textAlign: "center" }} my={"auto"}>
          <Box sx={{ p: "30px", mx: "auto", width: "max-content" }}>
            <Box component={"img"} width={"150px"} src={logo} alt="" />
          </Box>
          <Typography
            variant="h2"
            color="white"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {title}
          </Typography>
          <Typography variant="h5" color="#ccc">
            {subtitle}
          </Typography>
        </Grid>

        {/* Content */}
        <Grid  size={7} my={"auto"}>{children}</Grid>
      </Grid>
    </Box>
  );
};

export default OnboardingLayout;
