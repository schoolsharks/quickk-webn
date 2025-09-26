import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { StarsOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useCheckRewardClaimedQuery } from "../rewardsAndResourcesApi";
import AdvertisementUploadModal from "./AdvertisementUploadModal";

const AdvertiseBanner: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { totalStars } = useSelector((state: RootState) => state.user);

  const { data: rewardStatus, refetch } = useCheckRewardClaimedQuery({
    rewardType: "ADVERTISEMENT",
  });

  const isClaimed = rewardStatus?.claimed || false;
  const hasEnoughStars = totalStars >= 1000;

  const handleApplyClick = () => {
    if (!hasEnoughStars) {
      return; // Could show a toast or alert here
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSuccess = () => {
    refetch(); // Refresh the reward status
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#CD7BFF4D",
        }}
      >
        <Box padding={"14px"}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontWeight={"400"}
              fontSize={"16px"}
              color="primary.main"
            >
              Prime reward
            </Typography>
          </Box>
          <Typography
            fontWeight={"700"}
            fontSize={"25px"}
            lineHeight={"120%"}
            marginTop={"10px"}
          >
            Advertise Your Business.
            <br /> Shine in the Spotlight.
          </Typography>
          <Typography
            fontWeight={"400"}
            fontSize={"12px"}
            color="#404040"
            marginTop={"12px"}
          >
            Every star you earn brings you closer to visibility. Advertise your
            story, your business, your journey to the community.
          </Typography>
        </Box>

        <Button
          fullWidth
          onClick={handleApplyClick}
          disabled={!hasEnoughStars || isClaimed}
          sx={{
            borderRadius: "0",
            marginTop: "24px",
            bgcolor: hasEnoughStars ? "#404040" : "#ccc",
            color: hasEnoughStars ? "#fff" : "#666",
            fontSize: "25px",
            gap: "8px",
            "&:hover": {
              bgcolor: hasEnoughStars ? "#555" : "#ccc",
            },
            "&:disabled": {
              bgcolor: "#ccc",
              color: "#666",
            },
          }}
        >
          {isClaimed ? (
            <>Already Claimed</>
          ) : (
            <>
              Use 1000 <StarsOutlined sx={{ fontSize: "28px" }} />
            </>
          )}
          {/* {!hasEnoughStars && (
              <Typography fontSize="12px" sx={{ ml: 1 }}>
                (Need {1000 - totalStars} more stars)
              </Typography>
            )} */}
        </Button>
      </Box>

      <AdvertisementUploadModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default AdvertiseBanner;
