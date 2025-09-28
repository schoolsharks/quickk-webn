import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { ResourceCard, ResourceDetails } from "../../shared";
import { Eye } from "lucide-react";

interface PreviewResourceData {
  heading: string;
  subHeading: string;
  image: string | File;
  stars: number;
  companyName: string;
  description: {
    title: string;
    points: string[];
  }[];
}

interface ResourcePreviewProps {
  formData: PreviewResourceData;
}

const ResourcePreview: React.FC<ResourcePreviewProps> = ({ formData }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: "#CD7BFF4D",
        border: "1px solid #A04AD4",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Eye />
        <Typography fontWeight="600" fontSize="14px">
          Preview
        </Typography>
      </Box>

      <Box sx={{ padding: "16px" }}>
        {/* Preview Container */}
        <Box
          sx={{
            display: "flex",
            gap: "32px",
            height: "340px",
            alignItems: "flex-start",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Front View */}
          <Box sx={{ flex: 1, minWidth: "280px",height:"100%" }}>
            <Box
              sx={{
                backgroundColor: "#f8f9fa",
                padding: "24px",
                height: "100%",
              }}
            >
              <Typography fontWeight="600" fontSize="16px" marginBottom="16px">
                Front view
              </Typography>
              <Box maxWidth={"200px"} mx={"auto"}>
                <ResourceCard
                  resource={formData}
                  index={0}
                  showButton={true}
                  isPreview={true}
                />
              </Box>
            </Box>
          </Box>

          {/* Detailed View */}
          <Box sx={{ flex: 1.5, minWidth: "350px",height:"100%" }}>
            <Box
              sx={{
                padding: "24px",
                backgroundColor: "#f8f9fa",
                height: "100%",
                maxHeight: "600px",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c1c1",
                  borderRadius: "3px",
                  "&:hover": {
                    backgroundColor: "#a8a8a8",
                  },
                },
              }}
            >
              <Typography fontWeight="600" fontSize="16px" marginBottom="16px">
                Detailed view
              </Typography>
              <Box sx={{ border: `1px solid ${theme.palette.primary.main}` }}>
                <ResourceDetails
                  resource={formData}
                  showHeader={true}
                  isPreview={true}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResourcePreview;
