import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const LearningDetail: React.FC = () => {
  const [courseName, setCourseName] = useState("POSH");
  const [status, setStatus] = useState("Publish");
  const [validTill, setValidTill] = useState<Date | null>(
    new Date("2025-01-05")
  );
  const [publishOn, setPublishOn] = useState<Date | null>(
    new Date("2025-01-05")
  );
  const [duration, setDuration] = useState("10 Mins");

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          backgroundColor: "#121212",
          color: "white",
          p: 4,
          //   minHeight: "100vh",
        }}
      >
        {/* Course Details */}
        <Typography variant="h4" gutterBottom>
          Course Details
        </Typography>
        <Grid container spacing={1} mb={4} flexDirection={"column"}>
          <Typography variant="h6">Course Name</Typography>
          <Grid size={6}>
            <TextField
              fullWidth
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              variant="outlined"
              sx={{
                backgroundColor: "#1e1e1e",
                color: "white",
                "& .MuiPickersInputBase-root": {
                  borderRadius: "0",
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Validity */}
        <Typography variant="h4" gutterBottom>
          Validity
        </Typography>
        <Grid container spacing={2} mb={4}>
          <Grid size={6} flexDirection={"column"}>
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ backgroundColor: "#1e1e1e", color: "white" }}
              >
                <MenuItem value="Publish">Publish</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Draft">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6} flexDirection={"column"}>
            <Typography variant="h6" gutterBottom>
              Valid Till
            </Typography>
            <DatePicker
              value={validTill}
              onChange={(date) =>
                setValidTill(date ? new Date(date.valueOf()) : null)
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  sx: {
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    "& .MuiPickersInputBase-root": {
                      borderRadius: "0",
                    },
                  },
                  InputLabelProps: { sx: { color: "grey.500" } },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Course Settings */}

        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="h6" gutterBottom>
              Course Settings
            </Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                sx={{ backgroundColor: "#1e1e1e", color: "white" }}
              >
                <MenuItem value="5 Mins">5 Mins</MenuItem>
                <MenuItem value="10 Mins">10 Mins</MenuItem>
                <MenuItem value="15 Mins">15 Mins</MenuItem>
                <MenuItem value="15 Mins">20 Mins</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={6} flexDirection={"column"}>
            <Typography variant="h6" gutterBottom>
              Publish On
            </Typography>
            <DatePicker
              value={publishOn}
              onChange={(date) => setPublishOn(date ? new Date(date.valueOf()) : null)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                  sx: { backgroundColor: "#1e1e1e", color: "white" },
                  InputLabelProps: { sx: { color: "grey.500" } },
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default LearningDetail;
