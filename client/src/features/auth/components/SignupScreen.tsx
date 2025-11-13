import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Alert,
  useTheme,
  MenuItem,
} from "@mui/material";
import WebnLogo from "../../../assets/images/header/logo.webp";
import GlobalButton from "../../../components/ui/button";
import GoWomaniaLogo from "../../../assets/images/header/goWomania.webp";

interface SignupScreenProps {
  onSignup: (data: SignupData, ref?: string | null) => void;
  isLoading: boolean;
  error: string;
}

export interface SignupData {
  companyMail: string;
  name: string;
  businessName: string;
  contact: string;
  businessCategory: string;
  customBusinessCategory?: string;
  designation?: string;
  currentStage?: string;
  communityGoal?: string;
  interestedEvents?: string;
}

const businessCategories = [
  "Fine Jewellery",
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Health & Wellness",
  "Event Management & Wedding Planning",
  "Travel & Tourism",
  "Real Estate & Property Consultants",
  "Financial Services",
  "Legal Services",
  "Education & Coaching",
  "Interior Design & Architecture",
  "Graphic Design & Branding",
  "Digital Marketing & Social Media Management",
  "Website & App Development",
  "Home Décor & Furnishings",
  "Food & Beverages",
  "Photography & Videography",
  "Printing & Packaging Solutions",
  "Corporate Gifting & Personalized Gifts",
  "Handicrafts & Artisans",
  "Automobile Sales & Services",
  "Logistics & Courier Services",
  "HR & Recruitment Services",
  "IT Services & Software Solutions",
  "Stationery & Office Supplies",
  "PR & Media Consultancy",
  "Fitness Equipment & Sports Gear",
  "Childcare & Parenting Services",
  "NGOs & Social Enterprises",
  "Agriculture & Organic Products",
  "Other",
  "None",
];

const SignupScreen = ({ onSignup, isLoading, error }: SignupScreenProps) => {
  const theme = useTheme();
  const searchParams = new URLSearchParams(location.search);
  const ref = searchParams.get("ref");
  const [formData, setFormData] = useState<SignupData>({
    companyMail: "",
    name: "",
    businessName: "",
    contact: "",
    businessCategory: "",
    customBusinessCategory: "",
    designation: "",
    currentStage: "",
    communityGoal: "",
    interestedEvents: "",
  });

  const handleChange = (field: keyof SignupData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      // If "Other" is selected, use the custom category value instead
      const dataToSubmit = {
        ...formData,
        businessCategory: formData.businessCategory === "Other" 
          ? formData.customBusinessCategory || "" 
          : formData.businessCategory
      };
      onSignup(dataToSubmit, ref);
    }
  };

  const isFormValid = () => {
    const basicValidation = (
      formData.companyMail.trim() &&
      formData.name.trim() &&
      formData.businessName.trim() &&
      formData.contact.trim() &&
      formData.contact.length === 10 &&
      formData.businessCategory.trim()
    );

    // If "Other" is selected, also check if custom category is filled
    if (formData.businessCategory === "Other") {
      return basicValidation && formData.customBusinessCategory?.trim();
    }

    return basicValidation;
  };

  return (
    <Box
      overflow={"hidden"}
      p={"40px 24px 30px 24px"}
      sx={{
        color: "#fff",
        minHeight: window.innerHeight,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header Image */}
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box
          component="img"
          src={GoWomaniaLogo}
          border={`2px solid ${theme.palette.primary.main}`}
          borderRadius={"50%"}
          alt=""
          sx={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            padding: "2px",
          }}
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

      <Box mt={"20px"} mb={"10px"}>
        <Typography
          fontWeight="700"
          fontSize={"14px"}
          mb={"5px"}
          color={theme.palette.primary.main}
        >
          Signup
        </Typography>
        <Typography
          fontWeight="400"
          fontSize={"12px"}
          color={theme.palette.text.secondary}
          lineHeight={"16px"}
        >
          Certain spaces are reserved for WebN Members. Upgrade your journey and
          enjoy the complete experience.
        </Typography>
      </Box>

      <Box
        sx={{ width: "100%" }}
        display={"flex"}
        flexDirection={"column"}
        flex={1}
        justifyContent="space-between"
      >
        <Box
          mt={"20px"}
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          color={"black"}
          maxHeight="60vh"
          overflow="auto"
        >
          {/* Show error if any */}
          {error && (
            <Alert
              severity="error"
              sx={{
                bgcolor: "rgba(211, 47, 47, 0.1)",
                color: "#f44336",
                mb: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              placeholder="Name*"
              variant="standard"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <TextField
              placeholder="Business Name*"
              variant="standard"
              fullWidth
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
            />

            <TextField
              placeholder="Business email address*"
              variant="standard"
              fullWidth
              value={formData.companyMail}
              onChange={(e) => handleChange("companyMail", e.target.value)}
            />

            <TextField
              placeholder="Contact*"
              variant="standard"
              fullWidth
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
            />

            <TextField
              select
              placeholder="Category"
              variant="standard"
              fullWidth
              value={formData.businessCategory}
              onChange={(e) => handleChange("businessCategory", e.target.value)}
              SelectProps={{
                displayEmpty: true,
                renderValue: (value: unknown) => {
                  if (!value) {
                    return <span style={{ color: "#999" }}>Category</span>;
                  }
                  return value as string;
                },
              }}
            >
              {businessCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            {formData.businessCategory === "Other" && (
              <TextField
                placeholder="Please specify your business category*"
                variant="standard"
                fullWidth
                value={formData.customBusinessCategory || ""}
                onChange={(e) => handleChange("customBusinessCategory", e.target.value)}
              />
            )}
          </Stack>
        </Box>

        <Stack spacing={2} mt={2}>
          <GlobalButton
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            sx={{
              bgcolor: "#F0D7FF",
              color: "black",
            }}
          >
            {isLoading ? "Signing up..." : "Signup"}
          </GlobalButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default SignupScreen;
