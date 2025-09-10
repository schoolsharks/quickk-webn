import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  //   LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion, AnimatePresence } from "framer-motion";
import GlobalButton from "../../components/ui/button";
import { useUpdateUserProfileMutation } from "../../features/user/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

// Step 1: Industry Selection
const industries = [
  "Manufacturer",
  "Education",
  "Business Solutions",
  "Clothing",
  "Exporter",
  "Food",
  "Home Decor",
  "Finance",
  "Legal Services",
  "Event Planning",
];

// Step 2: Role Selection
const roles = [
  "Founder",
  "Investor",
  "Employee",
  "Student",
  "Manager",
  "Freelancer",
  "Coach",
  "Executive",
  "Educator",
  "Self Employed",
];

// Step 3: Current Stage
const stages = [
  "Idea stage",
  "Early prototype / MVP",
  "Launched product/service",
  "Scaling business",
];

// Step 4: Community Goals
const communityGoals = [
  "Finding investors",
  "Meeting co-founders or team members",
  "Mentorship & guidance",
  "Learning (workshops, resources, courses)",
  "Networking with other founders",
  "Collaboration & partnerships",
];

// Step 5: Event Interests
const eventTypes = [
  "Pitch events",
  "Networking mixers",
  "Investor meetups",
  "Panel discussions & talks",
];

interface StepProps {
  title: string;
  subtitle: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (options: string[]) => void;
  isMultiSelect?: boolean;
}

const SelectionStep: React.FC<StepProps> = ({
  title,
  subtitle,
  options,
  selectedOptions,
  onSelectionChange,
  isMultiSelect = true,
}) => {
  const theme = useTheme();

  const handleOptionClick = (option: string) => {
    if (isMultiSelect) {
      // Multi-select for industries
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];
      onSelectionChange(newSelection);
    } else {
      // Single select for roles
      onSelectionChange([option]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ padding: "0 20px" }}>
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: "20px",
            marginBottom: "8px",
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          {subtitle} {subtitle ? ":" : ""}
        </Typography>

        {/* Options Grid */}
        <Box
          display="grid"
          gridTemplateColumns="1fr"
          gap={2}
          sx={{ marginBottom: "40px" }}
        >
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option);

            return (
              <motion.div
                key={option}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                <Card
                  onClick={() => handleOptionClick(option)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: "0px",
                    border: isSelected
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.text.secondary}30`,
                    backgroundColor: isSelected
                      ? theme.palette.primary.light + "20"
                      : theme.palette.background.paper,
                    boxShadow: isSelected
                      ? `0 2px 8px ${theme.palette.primary.main}30`
                      : "0px 1px 3px rgba(0, 0, 0, 0.12)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? theme.palette.primary.light + "30"
                        : theme.palette.background.default,
                      transform: "translateY(-1px)",
                      boxShadow: isSelected
                        ? `0 4px 12px ${theme.palette.primary.main}40`
                        : "0px 2px 6px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ padding: "16px !important" }}>
                    <Box display="flex" alignItems="center">
                      {/* Selection Circle */}
                      <Box
                        sx={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: isSelected
                            ? `6px solid ${theme.palette.primary.main}`
                            : `2px solid ${theme.palette.text.secondary}`,
                          marginRight: "12px",
                          transition: "all 0.2s ease",
                          backgroundColor: isSelected
                            ? theme.palette.background.paper
                            : "transparent",
                        }}
                      />

                      {/* Option Text */}
                      <Typography
                        variant="body1"
                        sx={{
                          color: isSelected
                            ? theme.palette.primary.main
                            : theme.palette.text.primary,
                          fontWeight: isSelected ? 600 : 500,
                          fontSize: "16px",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {option}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </motion.div>
  );
};

const CompleteProfilePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { userId, companyMail, name } = useSelector(
    (state: RootState) => state.user
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<string[]>([]);
  const [selectedCommunityGoals, setSelectedCommunityGoals] = useState<
    string[]
  >([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

  const totalSteps = 5;
  //   const progress = (currentStep / totalSteps) * 100;

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete profile and update user data
      try {
        const profileData = {
          userId: userId,
          companyMail: companyMail,
          name: name,
          businessCategory: selectedIndustries.join(", "),
          designation: selectedRole[0] || "",
          currentStage: selectedStage[0] || "",
          communityGoal: selectedCommunityGoals.join(", "),
          interestedEvents: selectedEventTypes.join(", "),
        };

        await updateUserProfile(profileData).unwrap();
        localStorage.setItem("showStarsPopup", "true");
        navigate("/user/event-mode");
      } catch (error) {
        console.error("Error updating profile:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return selectedIndustries.length > 0;
    }
    if (currentStep === 2) {
      return selectedRole.length > 0;
    }
    if (currentStep === 3) {
      return selectedStage.length > 0;
    }
    if (currentStep === 4) {
      return selectedCommunityGoals.length > 0;
    }
    if (currentStep === 5) {
      return selectedEventTypes.length > 0;
    }
    return false;
  };

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Choose your Industry",
          subtitle: "You can select more than one",
          options: industries,
          selectedOptions: selectedIndustries,
          onSelectionChange: setSelectedIndustries,
          isMultiSelect: true,
        };
      case 2:
        return {
          title: "I am best described as",
          subtitle: "",
          options: roles,
          selectedOptions: selectedRole,
          onSelectionChange: setSelectedRole,
          isMultiSelect: false,
        };
      case 3:
        return {
          title: "What stage are you currently at?",
          subtitle: "",
          options: stages,
          selectedOptions: selectedStage,
          onSelectionChange: setSelectedStage,
          isMultiSelect: false,
        };
      case 4:
        return {
          title: "What are you looking for in this community?",
          subtitle: "",
          options: communityGoals,
          selectedOptions: selectedCommunityGoals,
          onSelectionChange: setSelectedCommunityGoals,
          isMultiSelect: true,
        };
      case 5:
        return {
          title: "Which type of events interest you the most?",
          subtitle: "",
          options: eventTypes,
          selectedOptions: selectedEventTypes,
          onSelectionChange: setSelectedEventTypes,
          isMultiSelect: true,
        };
      default:
        return {
          title: "",
          subtitle: "",
          options: [],
          selectedOptions: [],
          onSelectionChange: () => {},
          isMultiSelect: true,
        };
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.palette.text.secondary}20`,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={handleBack}
            sx={{
              color: theme.palette.text.primary,
              padding: "8px",
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            My Details
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      {/* <Box sx={{ padding: "0 20px", paddingTop: "16px" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: "4px",
            borderRadius: "2px",
            backgroundColor: theme.palette.text.secondary + "20",
            "& .MuiLinearProgress-bar": {
              backgroundColor: theme.palette.primary.main,
              borderRadius: "2px",
            },
          }}
        />
      </Box> */}

      {/* Step Content */}
      <Box sx={{ flex: 1, paddingTop: "24px" }}>
        <AnimatePresence mode="wait">
          <SelectionStep key={currentStep} {...getCurrentStepData()} />
        </AnimatePresence>
      </Box>

      {/* Step Indicators */}
      <Box
        display="flex"
        justifyContent="center"
        gap={1}
        sx={{ padding: "16px 20px" }}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <Box
            key={index}
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "0",
              border: "0.5px solid black",
              backgroundColor:
                index + 1 <= currentStep ? theme.palette.text.primary : "white",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </Box>

      {/* Next Button */}
      <Box sx={{ padding: "16px 20px", paddingBottom: "32px" }}>
        <GlobalButton
          onClick={handleNext}
          disabled={!canProceed()}
          fullWidth
          sx={{
            backgroundColor: canProceed()
              ? theme.palette.text.primary
              : theme.palette.text.secondary + "40",
            color: theme.palette.background.paper,
            borderRadius: "0px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "16px",
            padding: "16px",
            "&:hover": {
              backgroundColor: canProceed()
                ? theme.palette.text.secondary
                : theme.palette.text.secondary + "40",
            },
            "&:disabled": {
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.text.secondary + "20",
            },
          }}
        >
          {currentStep === totalSteps ? "Complete" : "Next"}
        </GlobalButton>
      </Box>
    </Box>
  );
};

export default CompleteProfilePage;
