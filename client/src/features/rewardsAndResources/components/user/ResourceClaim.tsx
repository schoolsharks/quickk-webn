import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { StarsOutlined } from "@mui/icons-material";
import {
  useApplyForRewardMutation,
  useCheckResourceClaimedQuery,
  useGetResourceByIdQuery,
} from "../../rewardsAndResourcesApi";
import { ResourceDetails } from "../shared";

interface ResourceClaimProps {
  resourceId: string;
}

const ResourceClaim: React.FC<ResourceClaimProps> = ({ resourceId }) => {
  const [userInput, setUserInput] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const {
    data: resourceData,
    isLoading: isResourceLoading,
    error: resourceError,
  } = useGetResourceByIdQuery(resourceId);
  const {
    data: claimData,
    isLoading: isClaimLoading,
    refetch: refetchClaimStatus,
  } = useCheckResourceClaimedQuery(resourceId);

  const [applyForReward, { isLoading: isApplying }] =
    useApplyForRewardMutation();

  if (isResourceLoading || isClaimLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (resourceError || !resourceData?.success) {
    return (
      <Box padding={2}>
        <Typography color="error">
          Failed to load resource details. Please try again.
        </Typography>
      </Box>
    );
  }

  const resource = resourceData.data;
  const isClaimed = claimData?.claimed || false;

  const handleUse = async () => {
    try {
      await applyForReward({
        rewardType: "RESOURCES",
        resourceId: resourceId,
        userInput: userInput.trim(),
      }).unwrap();

      // Refetch claim status to update UI
      refetchClaimStatus();

      // Reset form
      setUserInput("");
      setIsConfirmed(false);
    } catch (error) {
      console.error("Error applying for resource:", error);
      // You can add toast notification here
    }
  };

  return (
    <Box>
      <ResourceDetails
        resource={resource}
        showHeader={true}
        isPreview={false}
      />

      <Box padding="16px">
        {/* User Input Section */}
        <Box marginBottom="16px">
          <Typography
            fontWeight="600"
            fontSize="16px"
            color="#8B46FF"
            marginBottom="12px"
          >
            Tell us what you need.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Briefly describe what you're looking for (e.g., project type, budget, timeline)."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            variant="outlined"
            sx={{
              backgroundColor: "#f8f9fa",
              "& .MuiOutlinedinput-root": {
                backgroundColor: "#f8f9fa",
                borderRadius: "0px",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "0px",
              },
            }}
          />
        </Box>

        {/* Confirmation Checkbox */}
        <Box marginBottom="24px">
          <Typography
            fontWeight="600"
            fontSize="16px"
            color="#8B46FF"
            marginBottom="8px"
          >
            Please Confirm:
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                sx={{
                  color: "#8B46FF",
                  "&.Mui-checked": {
                    color: "#8B46FF",
                  },
                }}
              />
            }
            label="I understand that stars are non-refundable."
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "14px",
              },
            }}
          />
        </Box>
      </Box>
      {/* Use Button */}
      <Button
        fullWidth
        disabled={!isConfirmed || !userInput.trim() || isClaimed || isApplying}
        onClick={handleUse}
        sx={{
          backgroundColor: isClaimed ? "#ccc" : "#404040",
          color: "#fff",
          fontSize: "20px",
          fontWeight: "600",
          padding: "16px",
          borderRadius: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          "&:hover": {
            backgroundColor: isClaimed ? "#ccc" : "#555",
          },
          "&:disabled": {
            backgroundColor: "#ccc",
            color: "#999",
          },
        }}
      >
        {isApplying ? (
          <CircularProgress size={24} color="inherit" />
        ) : isClaimed ? (
          "Already Claimed"
        ) : (
          <>
            Use {resource.stars} <StarsOutlined sx={{ fontSize: "24px" }} />
          </>
        )}
      </Button>

      {isClaimed && (
        <Typography
          textAlign="center"
          fontSize="14px"
          color="text.secondary"
          marginTop="8px"
        >
          You have already claimed this resource.
        </Typography>
      )}
    </Box>
  );
};

export default ResourceClaim;
