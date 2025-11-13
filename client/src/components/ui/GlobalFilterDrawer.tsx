import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GreenButton from "./GreenButton";

interface FilterState {
  status: string;
  category: string;
  completionRate: string;
}

interface GlobalFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApply: () => void;
}

const GlobalFilterDrawer: React.FC<GlobalFilterDrawerProps> = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onApply,
}) => {
  const handleChange =
    (key: keyof FilterState) => (event: SelectChangeEvent) => {
      onFilterChange({
        ...filters,
        [key]: event.target.value,
      });
    };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        width={350}
        height="100%"
        bgcolor="#F0D7FF"
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
            <Typography variant="h5" color="black">
              Filters
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>

          {["Status", "Category", "Completion Rate"].map((label, idx) => {
            const key = ["status", "category", "completionRate"][
              idx
            ] as keyof FilterState;
            const options =
              key === "status"
                ? ["All", "Published", "Drafts", "Archived"]
                : key === "category"
                ? ["All", "Finance", "Tech", "Entertainment", "Science"]
                : ["All", "High", "Medium", "Low"];

            return (
              <FormControl fullWidth sx={{ mb: 3 }} key={key}>
                <FormLabel sx={{ color: "black", mb: 1, fontWeight: 500 }}>
                  {label}
                </FormLabel>
                <Select
                  value={filters[key]}
                  onChange={handleChange(key)}
                  displayEmpty
                  sx={{
                    bgcolor: "#F0D7FF",
                    color: "black",
                    "& .MuiSvgIcon-root": { color: "black" },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          })}
        </Box>

        <GreenButton
          onClick={onApply}
          fullWidth
          sx={{ background: "white", borderRadius: "2px" }}
        >
          Apply
        </GreenButton>
      </Box>
    </Drawer>
  );
};

export default GlobalFilterDrawer;
