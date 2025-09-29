import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GreenButton from "../../../components/ui/GreenButton";

export type SortOption =
  | "recentActivity"
  | "alphabetical"
  | "category"
  | "active"
  | "notActive"
  | "listed";

interface UserFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  onApply: () => void;
}

const UserFilterDrawer: React.FC<UserFilterDrawerProps> = ({
  open,
  onClose,
  sortBy,
  onSortChange,
  onApply,
}) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSortChange(event.target.value as SortOption);
  };

  const sortOptions = [
    { value: "recentActivity", label: "Recent Activity" },
    { value: "alphabetical", label: "Alphabetical (A-Z)" },
    { value: "category", label: "Business Category" },
    { value: "active", label: "Active Members" },
    { value: "notActive", label: "Not Active Members" },
    { value: "listed", label: "Listed Members" },
  ];

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        width={350}
        height="100%"
        bgcolor="#252525"
        px={"16px"}
        py={"24px"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" color="white">
              Sort Users
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel sx={{ color: "white", mb: 2, fontWeight: 500 }}>
              Sort By
            </FormLabel>
            <RadioGroup
              value={sortBy}
              onChange={handleSortChange}
              sx={{ gap: 1 }}
            >
              {sortOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
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
                      {option.label}
                    </Typography>
                  }
                />
              ))}
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

export default UserFilterDrawer;
