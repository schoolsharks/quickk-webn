import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { StarsOutlined } from "@mui/icons-material";

interface ResourceData {
  _id?: string;
  heading: string;
  subHeading: string;
  image: string | File;
  stars: number;
  companyName: string;
  isClaimed?: boolean;
}

interface ResourceCardProps {
  resource: ResourceData;
  index?: number;
  onClick?: (resourceId: string) => void;
  showButton?: boolean;
  isPreview?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  index = 0,
  onClick,
  showButton = true,
  isPreview = false,
}) => {
  const theme = useTheme();

  const handleClick = () => {
    if (onClick && resource._id) {
      onClick(resource._id);
    }
  };

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: isPreview ? "300px" : "auto",
      }}
    >
      {/* Main content area */}
      <Box
        sx={{
          backgroundColor:
            index % 4 === 2 || (index - 1) % 4 === 0 || index === 1
              ? "#CD7BFF4D"
              : "white",
          padding: "14px 7px",
          border: `1px solid ${theme.palette.primary.main}`,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          component={"img"}
          src={getImageUrl(resource.image) || '/placeholder-image.png'}
          alt={resource.heading}
          sx={{
            height: "34px",
            objectFit: "contain",
            objectPosition: "left",
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
              height: "34px",
              backgroundColor: "#f0f0f0",
              border: "1px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              color: "#999",
            }}
          >
            No Image
          </Box>
        )}

        {/* Content */}
        <Box sx={{ marginTop: "14px" }}>
          <Typography
            fontWeight={"700"}
            fontSize={"16px"}
            lineHeight={"110%"}
          >
            {resource.heading || 'Resource Title'}
          </Typography>
          <Typography
            fontWeight={"600"}
            fontSize={"12px"}
            lineHeight={"200%"}
          >
            {resource.subHeading || 'Resource description'}
          </Typography>
        </Box>
      </Box>

      {/* Button */}
      {showButton && (
        <Button
          fullWidth
          onClick={handleClick}
          disabled={resource.isClaimed}
          sx={{
            borderRadius: "0",
            backgroundColor: resource.isClaimed ? "#ccc" : "#404040",
            color: resource.isClaimed ? "#666" : "#fff",
            fontSize: "14px",
            fontWeight: "500",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            "&:hover": {
              backgroundColor: resource.isClaimed ? "#ccc" : "#555",
            },
            "&:disabled": {
              cursor: "not-allowed",
            },
          }}
        >
          {resource.isClaimed ? (
            "Already claimed"
          ) : (
            <>
              Use {resource.stars || 0} <StarsOutlined sx={{ fontSize: "18px" }} />
            </>
          )}
        </Button>
      )}

      {/* Company Name */}
      <Typography
        fontSize={"12px"}
        fontWeight={"600"}
        marginTop={"4px"}
      >
        {resource.companyName || 'Company Name'}
      </Typography>
    </Box>
  );
};

export default ResourceCard;