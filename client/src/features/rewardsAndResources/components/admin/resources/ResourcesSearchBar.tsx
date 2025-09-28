import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface ResourcesSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const ResourcesSearchBar: React.FC<ResourcesSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search reward by name, date",
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        variant="outlined"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "white" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#252525",
            color: "white",
            width:"100%",
            borderRadius: "0",
            maxWidth: "330px",
            "& fieldset": {
              borderColor: "#404040",
            },
            "&:hover fieldset": {
              borderColor: "#505050",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#A04AD4",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#ffffff80",
            opacity: 1,
          },
        }}
      />
    </Box>
  );
};

export default ResourcesSearchBar;
