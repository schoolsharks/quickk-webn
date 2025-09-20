import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon, Clear } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import GreenButton from "../../../../components/ui/GreenButton";
import GlobalFilterDrawer from "../../../../components/ui/GlobalFilterDrawer";

interface EventsSearchToolbarProps {
  onSearch: (searchTerm: string) => void;
  onFilterChange: (filters: EventFilters) => void;
  onDateFilter: (date: string | null) => void;
  onCreateEvent?: () => void;
}

interface EventFilters {
  status: string;
  city: string;
  dateRange: string;
}

const EventsSearchToolbar: React.FC<EventsSearchToolbarProps> = ({
  onSearch,
  onFilterChange,
  onDateFilter,
  onCreateEvent,
}) => {
  const [searchParams] = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current values from URL search params
  const searchTerm = searchParams.get("search") || "";
  const selectedDateString = searchParams.get("date");
  const status = searchParams.get("status") || "All";
  const city = searchParams.get("city") || "";

  // Convert date string to Dayjs object
  const selectedDate = selectedDateString ? dayjs(selectedDateString) : null;

  const filters: EventFilters = {
    status,
    city,
    dateRange: "All", // This can be expanded if needed
  };

  // Initialize local search term with URL param value
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearch(localSearchTerm);
      }
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [localSearchTerm, onSearch, searchTerm]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearchInputChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalSearchTerm(event.target.value);
  }, []);

  const handleDateChange = useCallback((date: any) => {
    // Convert date to ISO string format for API
    const dateString = date ? dayjs(date).format("YYYY-MM-DD") : null;
    onDateFilter(dateString);
  }, [onDateFilter]);

  const handleClearDate = useCallback(() => {
    onDateFilter(null);
  }, [onDateFilter]);

  const handleFilterChange = useCallback((newFilters: EventFilters) => {
    onFilterChange(newFilters);
  }, [onFilterChange]);

  const handleQuickStatusFilter = useCallback((event: SelectChangeEvent) => {
    const newFilters = { ...filters, status: event.target.value };
    handleFilterChange(newFilters);
  }, [filters, handleFilterChange]);

  const handleDrawerFilterChange = useCallback((drawerFilters: any) => {
    const newFilters: EventFilters = {
      status: drawerFilters.status,
      city: drawerFilters.category,
      dateRange: drawerFilters.completionRate,
    };
    handleFilterChange(newFilters);
  }, [handleFilterChange]);

  const handleDrawerApply = useCallback(() => {
    setFilterDrawerOpen(false);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setFilterDrawerOpen(false);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        {/* Search and Quick Filters */}
        <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
          {/* Search Input */}
          <TextField
            placeholder="Search events by name or location"
            value={localSearchTerm}
            onChange={handleSearchInputChange}
            sx={{
              minWidth: 300,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "black",
                borderRadius: "0px",
                color: "#FFFFFF",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Quick Status Filter */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={handleQuickStatusFilter}
              sx={{
                backgroundColor: "white",
                borderRadius: "0px",
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="past">Past</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>

          {/* Date Filter */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ position: "relative", minWidth: 200 }}>
              <DatePicker
                label="Filter by Date"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: "medium",
                    sx: {
                      backgroundColor: "white",
                      borderRadius: "0px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0px",
                      },
                    },
                    InputProps: {
                      endAdornment: selectedDate ? (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="clear date"
                            onClick={handleClearDate}
                            edge="end"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          {/* Filter Button
          <IconButton
            onClick={() => setFilterDrawerOpen(true)}
            sx={{
              backgroundColor: "#252525",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
              borderRadius: "8px",
            }}
          >
            <FilterIcon />
          </IconButton> */}
        </Stack>

        {/* Create Event Button */}
        {onCreateEvent && (
          <GreenButton onClick={onCreateEvent}>Create Event</GreenButton>
        )}
      </Box>

      {/* Filter Drawer */}
      <GlobalFilterDrawer
        open={filterDrawerOpen}
        onClose={handleDrawerClose}
        filters={{
          status: filters.status,
          category: filters.city,
          completionRate: filters.dateRange,
        }}
        onFilterChange={handleDrawerFilterChange}
        onApply={handleDrawerApply}
      />
    </>
  );
};

export default React.memo(EventsSearchToolbar);
