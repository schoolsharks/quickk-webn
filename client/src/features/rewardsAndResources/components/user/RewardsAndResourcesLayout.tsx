import { Box, Stack } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import TopBar from "./TopBar";
import StatsCards from "./StatsCards";
import ResourceClaim from "./ResourceClaim";
import AdvertiseBanner from "./AdvertiseBanner";
import Resources from "./Resources";

const RewardsAndResourcesLayout = () => {
  const [searchParams] = useSearchParams();
  const resourceId = searchParams.get("resourceId");

  return (
    <Stack>
      <TopBar />
      <StatsCards />
      {resourceId ? (
        <Box>
          <ResourceClaim resourceId={resourceId} />
        </Box>
      ) : (
        <>
          <Box marginTop="40px">
            <AdvertiseBanner />
          </Box>
          <Box padding={"16px"}>
            <Resources />
          </Box>
        </>
      )}
    </Stack>
  );
};

export default RewardsAndResourcesLayout;
