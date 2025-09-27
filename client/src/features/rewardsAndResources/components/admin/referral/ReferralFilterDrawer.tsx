import React from "react";
import {
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GreenButton from "../../../../../components/ui/GreenButton";

export type ReferralSortOption =
  | "mostStars"
  | "leastStars"
  | "recent"
  | "hasClaim";

interface ReferralFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  sortBy: ReferralSortOption;
  onSortChange: (sort: ReferralSortOption) => void;
  onApply: () => void;
}

const ReferralFilterDrawer: React.FC<ReferralFilterDrawerProps> = ({
  open,
  onClose,
  sortBy,
  onSortChange,
  onApply,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSortChange(event.target.value as ReferralSortOption);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        width={350}
        height="100%"
        bgcolor="#252525"
        px="16px"
        py="24px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" color="white">
              Sort Referrals
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ color: "white", mb: 2, fontWeight: 500 }}>
              Sort By
            </FormLabel>
            <RadioGroup value={sortBy} onChange={handleChange} sx={{ gap: 1 }}>
              <FormControlLabel
                value="mostStars"
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "#A04AD4",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "white", fontSize: "16px" }}>
                    Most Stars
                  </Typography>
                }
              />
              <FormControlLabel
                value="leastStars"
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "#A04AD4",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "white", fontSize: "16px" }}>
                    Least Stars
                  </Typography>
                }
              />
              <FormControlLabel
                value="recent"
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "#A04AD4",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "white", fontSize: "16px" }}>
                    Recent Activity
                  </Typography>
                }
              />
              <FormControlLabel
                value="hasClaim"
                control={
                  <Radio
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "#A04AD4",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: "white", fontSize: "16px" }}>
                    Advertise Applicants
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <GreenButton
          onClick={onApply}
          fullWidth
          sx={{ background: "black", borderRadius: "2px", color: "white" }}
        >
          Apply
        </GreenButton>
      </Box>
    </Drawer>
  );
};

export default ReferralFilterDrawer;
