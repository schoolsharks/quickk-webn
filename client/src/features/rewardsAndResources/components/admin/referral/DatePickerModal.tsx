import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useGetAvailableAdvertisementDatesQuery } from "../../../rewardsAndResourcesApi";

interface DatePickerModalProps {
  open: boolean;
  onClose: () => void;
  onDateSelect: (selectedDate: Date) => void;
  userName: string;
  isLoading?: boolean;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  open,
  onClose,
  onDateSelect,
  userName,
  isLoading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const {
    data: availableDatesResponse,
    isLoading: isDatesLoading,
    error: datesError,
  } = useGetAvailableAdvertisementDatesQuery(undefined, {
    skip: !open,
  });

  const availableDates = availableDatesResponse?.data || [];

  const handleConfirm = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
    }
  };

  const handleClose = () => {
    setSelectedDate(null);
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "#333",
          }}
        >
          Select Advertisement Date
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Choose a date to advertise <strong>{userName}</strong> in the daily pulse
            </Typography>
          </Box>

          {isDatesLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : datesError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load available dates. Please try again.
            </Alert>
          ) : availableDates.length === 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No available dates for advertisement. All upcoming dates already have advertisements.
            </Alert>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => {
                  // Convert DayJS to Date if needed
                  const date = newValue ? (newValue instanceof Date ? newValue : new Date(newValue.toString())) : null;
                  setSelectedDate(date);
                }}
                shouldDisableDate={(day) => {
                  if (!day) return true;
                  
                  // Convert DayJS to Date
                  const date = day instanceof Date ? day : new Date(day.toString());
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  // Disable dates before today
                  if (date < today) {
                    return true;
                  }

                  // Check if the date is in available dates
                  const dateString = date.toISOString().split('T')[0];
                  return !availableDates.some((availableDate: string) => {
                    const availableDateString = new Date(availableDate).toISOString().split('T')[0];
                    return availableDateString === dateString;
                  });
                }}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#A04AD4",
                        },
                        "&:hover fieldset": {
                          borderColor: "#A04AD4",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#A04AD4",
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          )}

          {availableDates.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Only dates without existing advertisements are selectable
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: "#A04AD4",
              color: "#A04AD4",
              "&:hover": {
                borderColor: "#8A3BB8",
                backgroundColor: "#F3E8FF",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!selectedDate || isLoading}
            sx={{
              backgroundColor: "#A04AD4",
              "&:hover": {
                backgroundColor: "#8A3BB8",
              },
              "&:disabled": {
                backgroundColor: "#D1D5DB",
                color: "#6B7280",
              },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              "Add Advertisement"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DatePickerModal;