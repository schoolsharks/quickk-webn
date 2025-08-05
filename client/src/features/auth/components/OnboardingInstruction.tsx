import React from "react";
import { Box, Typography } from "@mui/material";

interface Step {
    title: string;
    subtitle: string;
    description: string;
}

interface OnboardingInstructionProps {
    steps: Step[];
    activeStep: number;
}

const OnboardingInstruction: React.FC<OnboardingInstructionProps> = ({ steps, activeStep }) => {
    return (
        <Box
            mt={"24px"}
            sx={{
                textAlign: "left",
                width: "100%",
                px: "22px",
            }}
        >
            <Typography fontWeight={700} fontSize={"30px"} lineHeight={"35px"}>
                {steps[activeStep].title}
            </Typography>
            <Typography fontWeight={500} fontSize={"30px"} lineHeight={"35px"}>
                {steps[activeStep].subtitle}
            </Typography>
            <Typography mt={"28px"} fontSize={"14px"} fontWeight={400} lineHeight={"22px"}>
                {steps[activeStep].description}
            </Typography>
        </Box>
    );
};

export default OnboardingInstruction;