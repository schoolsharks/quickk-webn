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
  const handleInputChange = (field: string, value: any) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <Box sx={{ backgroundColor: "#F0D7FF", p: 3 }}>
      <Typography variant="h6" color="black" mb={2}>
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
                <Typography color="black" mb={1} fontSize="14px">
                  Title *
                </Typography>
                <TextField
                  fullWidth
                  value={formData.heading}
                  placeholder="New Resource"
                  onChange={(e) => onFormDataChange({ heading: e.target.value })}
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: 0,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                    input: { color: "black" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="black" mb={1} fontSize="14px">
                  Offer *
                </Typography>
                <TextField
                  fullWidth
                  placeholder="eg. 20% off"
                  value={formData.subHeading}
                  onChange={(e) => onFormDataChange({ subHeading: e.target.value })}
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: 0,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                    input: { color: "black" },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="black" mb={1} fontSize="14px">
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
                      backgroundColor: "#ffffff", 
                      color: "black",
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
              <Typography color="black" mb={1} fontSize="14px">
                Target Audience
              </Typography>
              <Box display="flex" gap={2}>
                {["All", "Gowomania Only", "Webn Only"].map((audience) => (
                  <Box bgcolor={"#fff"} padding={"4px"} key={audience}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.targetAudience[0] === audience}
                          onChange={(e) =>
                            handleInputChange(
                              "targetAudience",
                              e.target.checked ? [audience] : []
                            )
                          }
                          size="medium"
                          sx={{
                            color: "black",
                            "&.Mui-checked": {
                              color: "primary.main",
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "16px",color:"black" }}
                        >
                          {audience}
                        </Typography>
                      }
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceBasicDetails;