import React from "react";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import GreenButton from "../ui/GreenButton";

interface GlobalToolbarProps {
  buttonTitle: string;
  onButtonClick: () => void;
  onFilterClick: () => void;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
}

const GlobalToolbar: React.FC<GlobalToolbarProps> = ({
  buttonTitle,
  onButtonClick,
  onFilterClick,
  onSearchChange,
  placeholder = "search",
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      gap={2}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        bgcolor="#1A1A1A"
        px={2}
        py={1}
        borderRadius="4px"
      >
        <SearchIcon />
        <InputBase
          placeholder={`search ${placeholder}`}
          //   fullWidth
          onChange={(e) => onSearchChange?.(e.target.value)}
          sx={{ color: "white" }}
        />
      </Box>
      <Box display={"flex"} gap={"18px"}>
        <IconButton onClick={onFilterClick} sx={{ gap: 1 }}>
          <FilterListAltIcon sx={{ color: "white" }} />
          <Typography variant="h3" fontSize={"16px"}>
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
  );
};

export default GlobalToolbar;
