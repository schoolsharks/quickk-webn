import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import GreenButton from "../../../../components/ui/GreenButton";
import GlobalFilterDrawer from "../../../../components/ui/GlobalFilterDrawer";

interface DailyPulseSearchToolbarProps {
  buttonTitle: string;
  onButtonClick: () => void;
  onDateChange: (date: Date | null) => void;
  onStatusChange: (status: string) => void;
  searchDate: Date | null;
  searchStatus: string;
}

const DailyPulseSearchToolbar: React.FC<DailyPulseSearchToolbarProps> = ({
  buttonTitle,
  onButtonClick,
  onDateChange,
  onStatusChange,
  searchDate,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "All",
    category: "All",
    completionRate: "All",
  });

  const handleFilterApply = () => {
    if (filters.status != "All") {
      onStatusChange(filters.status);
    } else onStatusChange("");
    setFiltersOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        gap={2}
      >
        <Box display="flex" gap={2}>
          <Box
            bgcolor="#1A1A1A"
            px={2}
            py={1}
            borderRadius="4px"
            minWidth="200px"
          >
            <DatePicker
              label="Search by Date"
              value={searchDate}
              onChange={onDateChange}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    "& .MuiInputBase-root": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                    "& .MuiPickersSectionList-section ": {
                      color: "white",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Box display="flex" gap="18px">
          <IconButton onClick={() => setFiltersOpen(true)} sx={{ gap: 1 }}>
            <FilterListAltIcon sx={{ color: "primary.main" }} />
            <Typography variant="h3" fontSize="16px" color="primary.main">
              Filters
            </Typography>
          </IconButton>
          <GreenButton
            onClick={onButtonClick}
            sx={{ background: "white", borderRadius: "2px" }}
          >
            {buttonTitle}
          </GreenButton>
        </Box>
      </Box>

      <GlobalFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onApply={handleFilterApply}
      />
    </LocalizationProvider>
  );
};

export default DailyPulseSearchToolbar;
