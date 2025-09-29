import React from "react";
import { Box, Typography } from "@mui/material";

interface ResourceDescriptionSection {
  title: string;
  points: string[];
}

interface ResourceDetailsData {
  heading: string;
  subHeading: string;
  image: string | File;
  description: ResourceDescriptionSection[];
  companyName?: string;
}

interface ResourceDetailsProps {
  resource: ResourceDetailsData;
  showHeader?: boolean;
  isPreview?: boolean;
}

const ResourceDetails: React.FC<ResourceDetailsProps> = ({
  resource,
  showHeader = true,
  isPreview = false,
}) => {
  // Get image URL - handle File objects for preview
  const getImageUrl = (image: string | File): string => {
    if (typeof image === 'string') {
      return image;
    }
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return '';
  };

  return (
    <Box>
      {/* Header Section */}
      {showHeader && (
        <Box
          sx={{
            padding: isPreview ? "16px" : "24px 16px 16px",
            borderRadius: isPreview ? "4px 4px 0 0" : "8px 8px 0 0",
          }}
        >
          <Typography 
            fontWeight={"600"} 
            fontSize={"16px"} 
            color="primary.main"
            sx={{ marginBottom: "8px" }}
          >
            Prime reward
          </Typography>
          <Box
            component="img"
            src={getImageUrl(resource.image) || '/placeholder-image.png'}
            alt={resource.heading}
            sx={{
              objectFit: "contain",
              marginBottom: "16px",
              width: "100%",
              maxHeight: isPreview ? "60px" : "auto",
              display: getImageUrl(resource.image) ? 'block' : 'none',
            }}
            onError={(e) => {
              // Fallback for broken images
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          
          {/* Fallback when no image */}
          {!getImageUrl(resource.image) && (
            <Box
              sx={{
                height: isPreview ? "60px" : "120px",
                backgroundColor: "#f0f0f0",
                border: "1px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#999",
                marginBottom: "16px",
              }}
            >
              No Image
            </Box>
          )}
          <Typography
            fontWeight="700"
            fontSize={isPreview ? "18px" : "24px"}
            lineHeight="120%"
            marginBottom="8px"
          >
            {resource.heading || 'Resource Title'}
          </Typography>
          <Typography 
            fontWeight="600" 
            fontSize={isPreview ? "14px" : "16px"} 
            color="text.secondary"
          >
            {resource.subHeading || 'Resource description'}
          </Typography>
        </Box>
      )}

      {/* Description Sections */}
      <Box padding={isPreview ? "12px" : "16px"}>
        {resource.description?.filter(section => 
          section.title && section.points?.some(point => point.trim())
        ).map((section, index) => (
          <Box key={index} marginBottom={isPreview ? "16px" : "36px"}>
            <Typography
              fontWeight="700"
              fontSize={isPreview ? "14px" : "20px"}
              color="primary.main"
              marginBottom={isPreview ? "8px" : "12px"}
            >
              {section.title}
            </Typography>
            <Box component="ul" sx={{ paddingLeft: "16px", margin: 0 }}>
              {section.points?.filter(point => point.trim()).map((point, pointIndex) => (
                <Box
                  key={pointIndex}
                  component="li"
                  sx={{
                    marginBottom: isPreview ? "4px" : "4px",
                    fontSize: isPreview ? "12px" : "18px",
                    lineHeight: "120%",
                    color: "text.primary",
                    fontWeight:"600"
                  }}
                >
                  {point}
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {(!resource.description || resource.description.length === 0) && (
          <Box padding={2} textAlign="center">
            <Typography color="text.secondary" fontStyle="italic">
              No description sections added yet
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResourceDetails;