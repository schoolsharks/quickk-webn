import React from "react";
import { Box, Typography, Grid, Button, useTheme } from "@mui/material";
import { StarsOutlined } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { useGetAllResourcesQuery } from "../rewardsAndResourcesApi";

const Resources: React.FC = () => {
  const { data: resourcesData, isLoading } = useGetAllResourcesQuery();
  const [, setSearchParams] = useSearchParams();
  const theme = useTheme();

  const handleResourceClick = (resourceId: string) => {
    setSearchParams({ resourceId });
  };

  if (isLoading) {
    return (
      <Box>
        <Typography fontWeight={"600"}>Explore all</Typography>
        <Typography>Loading resources...</Typography>
      </Box>
    );
  }

  const resources = resourcesData?.data || [];

  return (
    <Box>
      <Typography fontWeight={"600"}>Explore all</Typography>
      <Grid container spacing={1} marginTop={"6px"}>
        {resources.map((resource, index) => (
          <Grid size={6} key={resource._id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
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
                  src={resource.image}
                  alt={resource.heading}
                  sx={{
                    height: "34px",
                    objectFit: "contain",
                    objectPosition: "left",
                  }}
                />

                {/* Content */}
                <Box sx={{ marginTop: "20px" }}>
                  <Typography
                    fontWeight={"700"}
                    fontSize={"16px"}
                    lineHeight={"120%"}
                  >
                    {resource.heading}
                  </Typography>
                  <Typography
                    fontWeight={"600"}
                    fontSize={"12px"}
                    marginTop={"4px"}
                  >
                    {resource.subHeading}
                  </Typography>
                </Box>
              </Box>

              {/* Button */}
              <Button
                fullWidth
                onClick={() => handleResourceClick(resource._id)}
                sx={{
                  borderRadius: "0",
                  backgroundColor: "#404040",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  "&:hover": {
                    backgroundColor: "#555",
                  },
                }}
              >
                Use {resource.stars} <StarsOutlined sx={{ fontSize: "18px" }} />
              </Button>

              {/* Company Name */}
              <Typography
                fontSize={"12px"}
                fontWeight={"600"}
                marginTop={"4px"}
              >
                {resource.companyName}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Resources;
