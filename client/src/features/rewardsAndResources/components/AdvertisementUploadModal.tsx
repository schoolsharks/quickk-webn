import React, { useState } from "react";
import {
  Dialog,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useApplyForRewardMutation } from "../rewardsAndResourcesApi";

interface AdvertisementUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdvertisementUploadModal: React.FC<AdvertisementUploadModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [applyForReward, { isLoading }] = useApplyForRewardMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please select an image to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("rewardType", "ADVERTISEMENT");
      formData.append("advertisementBanner", selectedFile);

      await applyForReward(formData).unwrap();
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.data?.message || "Failed to submit reward application");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": { borderRadius: "0" },
      }}
    >
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        {/* <Typography variant="h5">Upload your business advertisement banner.</Typography> */}
        <IconButton onClick={handleClose}>
          <Close sx={{ fontSize: "22px" }} />
        </IconButton>
      </Box>

      <Box padding={"0 24px 24px"}>
        <Typography variant="h5" gutterBottom>
          Upload your business advertisement banner.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            border: "2px dashed #BDBDBD",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            minHeight: "120px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#FAFAFA",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "#F5F5F5",
            },
            mb: 2,
          }}
          component="label"
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <CloudUpload sx={{ fontSize: 48, color: "#9E9E9E", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Supported formats: JPG / PNG
          </Typography>
        </Box>

        {previewUrl && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </Box>
        )}

        <Box display={"flex"} justifyContent={"space-between"}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!selectedFile || isLoading}
            sx={{ borderRadius: 0 }}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AdvertisementUploadModal;
