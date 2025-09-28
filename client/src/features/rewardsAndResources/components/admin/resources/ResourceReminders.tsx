import React from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface ResourceRemindersProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  expiryDate: Dayjs;
  onExpiryDateChange: (date: Dayjs) => void;
}

const ResourceReminders: React.FC<ResourceRemindersProps> = ({
  quantity,
  onQuantityChange,
  expiryDate,
  onExpiryDateChange,
}) => {
  return (
    <Box sx={{ backgroundColor: "#1A1A1A", p: 3 }}>
      <Typography variant="h6" color="white" mb={2}>
        Reminders
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="white" mb={1} fontSize="14px">
            Quantity *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
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
            Expiry Date *
          </Typography>
          <DatePicker
            value={expiryDate}
            onChange={(date) => date && onExpiryDateChange(dayjs(date))}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: {
                  backgroundColor: "#2A2A2A",
                  borderRadius: 0,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                  "& *":{
                    color:"#fff"
                  },
                  input: { color: "white" },
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceReminders;