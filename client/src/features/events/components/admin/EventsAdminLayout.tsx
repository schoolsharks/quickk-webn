import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import EventsStats from "./EventsStats";
import EventsSearchToolbar from "./EventsSearchToolbar";
import EventCard from "./EventCard";
import {
  useGetAdminEventStatsQuery,
  useGetAllEventsAdminQuery,
  useSearchEventsAdminQuery,
  useDeleteEventMutation,
  useCloneEventMutation,
} from "../../services/eventsApi";

interface EventFilters {
  status: string;
  city: string;
  dateRange: string;
}

interface EventsAdminLayoutProps {
  onCreateEvent?: () => void;
  onEditEvent?: (eventId: string) => void;
}

const EventsAdminLayout: React.FC<EventsAdminLayoutProps> = ({
  onCreateEvent,
  onEditEvent,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Extract values from URL search params
  const searchTerm = searchParams.get("search") || "";
  const selectedDate = searchParams.get("date");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const status = searchParams.get("status") || "All";
  const city = searchParams.get("city") || "";

  // Derived state
  const isSearching = useMemo(
    () => !!(searchTerm || selectedDate),
    [searchTerm, selectedDate]
  );

  // API hooks
  const { data: statsData, isLoading: statsLoading } =
    useGetAdminEventStatsQuery({});

  const {
    data: eventsData,
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = useGetAllEventsAdminQuery(
    {
      page,
      limit: 12,
      status: status !== "All" ? status : undefined,
      city: city || undefined,
      startDate: selectedDate || undefined,
    },
    { skip: isSearching }
  );

  const {
    data: searchData,
    isLoading: searchLoading,
    refetch: refetchSearch,
  } = useSearchEventsAdminQuery(
    {
      q: searchTerm,
      status: status !== "All" ? status : undefined,
      city: city || undefined,
      startDate: selectedDate || undefined,
      page,
      limit: 12,
    },
    { skip: !isSearching }
  );

  const [deleteEvent] = useDeleteEventMutation();
  const [cloneEvent] = useCloneEventMutation();

  // Data to display
  const currentData = isSearching ? searchData : eventsData;
  const currentLoading = isSearching ? searchLoading : eventsLoading;

  // Helper function to update URL params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === "" || value === "All") {
            newParams.delete(key);
          } else {
            newParams.set(key, value);
          }
        });

        return newParams;
      });
    },
    [setSearchParams]
  );

  const handleSearch = useCallback(
    (term: string) => {
      updateSearchParams({
        search: term,
        page: "1", // Reset to page 1 when searching
      });
    },
    [updateSearchParams]
  );

  const handleFilterChange = useCallback(
    (newFilters: EventFilters) => {
      updateSearchParams({
        status: newFilters.status,
        city: newFilters.city,
        page: "1", // Reset to page 1 when filtering
      });
    },
    [updateSearchParams]
  );

  const handleDateFilter = useCallback(
    (date: string | null) => {
      updateSearchParams({
        date,
        page: "1", // Reset to page 1 when date filtering
      });
    },
    [updateSearchParams]
  );

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, value: number) => {
      updateSearchParams({
        page: value.toString(),
      });
    },
    [updateSearchParams]
  );

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      try {
        await deleteEvent(eventId).unwrap();
        setSnackbar({
          open: true,
          message: "Event deleted successfully",
          severity: "success",
        });
        // Refetch data
        if (isSearching) {
          refetchSearch();
        } else {
          refetchEvents();
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to delete event",
          severity: "error",
        });
      }
    },
    [deleteEvent, isSearching, refetchSearch, refetchEvents]
  );

  const handleCloneEvent = useCallback(
    async (eventId: string) => {
      try {
        await cloneEvent(eventId).unwrap();
        setSnackbar({
          open: true,
          message: "Event cloned successfully",
          severity: "success",
        });
        // Refetch data
        if (isSearching) {
          refetchSearch();
        } else {
          refetchEvents();
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to clone event",
          severity: "error",
        });
      }
    },
    [cloneEvent, isSearching, refetchSearch, refetchEvents]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Stats Section */}
      <Box sx={{ mb: 4 }}>
        {statsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : statsData ? (
          <EventsStats stats={statsData} />
        ) : (
          <Typography variant="body1" color="text.secondary">
            Unable to load statistics
          </Typography>
        )}
      </Box>

      {/* Search and Filter Section */}
      <EventsSearchToolbar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onDateFilter={handleDateFilter}
        onCreateEvent={onCreateEvent}
      />

      {/* Events Grid Section */}
      <Box sx={{ mb: 3 }}>
        {currentLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : currentData?.events && currentData.events.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {currentData.events.map((event: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event._id}>
                  <EventCard
                    event={event}
                    onEdit={onEditEvent}
                    onDelete={handleDeleteEvent}
                    onClone={handleCloneEvent}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {currentData.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={currentData.totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {isSearching ? "No events found" : "No events available"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSearching
                ? "Try adjusting your search criteria"
                : "Create your first event to get started"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventsAdminLayout;
