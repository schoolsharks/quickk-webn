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
    <Box sx={{ backgroundColor: "#F0D7FF", p: 3 }}>
      <Typography variant="h6" color="black" mb={2}>
        Reminders
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography color="black" mb={1} fontSize="14px">
            Quantity *
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            sx={{
              backgroundColor: "#fff",
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
            Expiry Date *
          </Typography>
          <DatePicker
            value={expiryDate}
            onChange={(date) => date && onExpiryDateChange(dayjs(date))}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: {
                  backgroundColor: "#fff",
                  borderRadius: 0,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                  "& *":{
                    color:"black",
                    borderRadius:0
                  },
                  input: { color: "black" },
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