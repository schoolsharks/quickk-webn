import React from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ImageUpload from "../../../../../components/ui/ImageUpload";

interface ResourceFormData {
  heading: string;
  subHeading: string;
  image: string | File;
  type: "SERVICE" | "PRODUCT";
  targetAudience: string[];
}

interface ResourceBasicDetailsProps {
  formData: ResourceFormData;
  onFormDataChange: (updates: Partial<ResourceFormData>) => void;
}

const ResourceBasicDetails: React.FC<ResourceBasicDetailsProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handleTargetAudienceChange = (audience: string, checked: boolean) => {
    if (checked) {
      onFormDataChange({
        targetAudience: [...formData.targetAudience, audience],
      });
    } else {
      onFormDataChange({
        targetAudience: formData.targetAudience.filter((a) => a !== audience),
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#1A1A1A", p: 3 }}>
      <Typography variant="h6" color="white" mb={2}>
        Basic Details
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <ImageUpload
            value={formData.image}
            onChange={(value) => onFormDataChange({ image: value })}
            label="Logo"
            height={120}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="white" mb={1} fontSize="14px">
                  Title *
                </Typography>
                <TextField
                  fullWidth
                  value={formData.heading}
                  onChange={(e) => onFormDataChange({ heading: e.target.value })}
                  sx={{
                    backgroundColor: "#2A2A2A",
                    borderRadius: 0,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                    input: { color: "white" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="white" mb={1} fontSize="14px">
                  Offer *
                </Typography>
                <TextField
                  fullWidth
                  value={formData.subHeading}
                  onChange={(e) => onFormDataChange({ subHeading: e.target.value })}
                  sx={{
                    backgroundColor: "#2A2A2A",
                    borderRadius: 0,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                    input: { color: "white" },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="white" mb={1} fontSize="14px">
                  Voucher Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formData.type}
                    onChange={(e) =>
                      onFormDataChange({
                        type: e.target.value as "SERVICE" | "PRODUCT",
                      })
                    }
                    sx={{ 
                      backgroundColor: "#2A2A2A", 
                      color: "white",
                      borderRadius: 0,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 0,
                      }
                    }}
                  >
                    <MenuItem value="SERVICE">Service</MenuItem>
                    <MenuItem value="PRODUCT">Product</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Target Audience */}
            <Box>
              <Typography color="white" mb={1} fontSize="14px">
                Target Audience
              </Typography>
              <Stack direction="row" spacing={2}>
                {["All", "Gowomania Only", "Webn Only"].map((audience) => (
                  <FormControlLabel
                    key={audience}
                    control={
                      <Checkbox
                        checked={formData.targetAudience.includes(audience)}
                        onChange={(e) =>
                          handleTargetAudienceChange(audience, e.target.checked)
                        }
                        sx={{ color: "white" }}
                      />
                    }
                    label={audience}
                    sx={{ color: "white" }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceBasicDetails;