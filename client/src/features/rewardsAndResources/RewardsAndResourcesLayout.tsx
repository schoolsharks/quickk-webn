import { Box, Stack } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import TopBar from "./components/TopBar";
import StatsCards from "./components/StatsCards";
import AdvertiseBanner from "./components/AdvertiseBanner";
import Resources from "./components/Resources";
import ResourceClaim from "./components/ResourceClaim";

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
