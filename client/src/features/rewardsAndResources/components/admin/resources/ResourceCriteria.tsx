import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

interface ResourceCriteriaProps {
  stars: number;
  onStarsChange: (stars: number) => void;
  selectedEmailDestination: "user" | "company";
  onEmailDestinationChange: (destination: "user" | "company") => void;
  userEmail?: string;
  companyEmail?: string;
}

const ResourceCriteria: React.FC<ResourceCriteriaProps> = ({
  stars,
  onStarsChange,
  selectedEmailDestination,
  onEmailDestinationChange,
  userEmail = "",
  companyEmail = "",
}) => {
  return (
    <Box sx={{ backgroundColor: "#1A1A1A", p: 3 }}>
      <Typography variant="h6" color="white" mb={2}>
        Reward Criteria
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="white" mb={1} fontSize="14px">
            Stars Needed To Redeem *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={stars}
            onChange={(e) => onStarsChange(Number(e.target.value))}
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
            All Requests will be sent to
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedEmailDestination}
              onChange={(e) =>
                onEmailDestinationChange(e.target.value as "user" | "company")
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
              <MenuItem value="user">
                User Email ({userEmail || "Not set"})
              </MenuItem>
              <MenuItem value="company">
                Company Email ({companyEmail || "Not set"})
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceCriteria;