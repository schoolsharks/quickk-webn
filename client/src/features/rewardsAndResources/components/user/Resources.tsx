import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useGetAllResourcesQuery } from "../../rewardsAndResourcesApi";
import { ResourceCard } from "../shared";

const Resources: React.FC = () => {
  const { data: resourcesData, isLoading } = useGetAllResourcesQuery();
  const [, setSearchParams] = useSearchParams();

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
            <ResourceCard
              resource={resource}
              index={index}
              onClick={handleResourceClick}
              showButton={true}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Resources;
