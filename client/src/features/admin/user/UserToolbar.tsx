import React from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon, Upload, FilterList } from "@mui/icons-material";
import GreenButton from "../../../components/ui/GreenButton";
// import { useCreateBlankUserMutation } from "../service/adminApi";
import { useNavigate } from "react-router-dom";

interface UserToolbarProps {
  onSearchChange: (value: string) => void;
  searchValue: string;
  onFilterClick: () => void;
  button?: boolean;
}

const UserToolbar: React.FC<UserToolbarProps> = ({
  onSearchChange,
  onFilterClick,
  button = true,
  // searchValue,
}) => {
  const theme = useTheme();
  // const [CreateBlankUser] = useCreateBlankUserMutation();
  const navigate = useNavigate();

  // const handleCreateUser = () => {
  //   CreateBlankUser({})
  //     .unwrap()
  //     .then((data) => {
  //       navigate(`/admin/user/${data}`);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleBulkUpload = () => {
    navigate("/admin/members/new-members");
  };

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
        bgcolor={theme.palette.text.secondary}
        px={2}
        py={1}
        borderRadius="4px"
      >
        <SearchIcon sx={{ color: "white" }} />
        <InputBase
          placeholder="search name, company mail, contact"
          onChange={(e) => onSearchChange?.(e.target.value)}
          sx={{ color: "white" }}
        />
      </Box>
      <Box display={"flex"} gap={"18px"} color={theme.palette.primary.light}>
        <IconButton onClick={onFilterClick} sx={{ gap: 1 }}>
          <FilterList sx={{ color: theme.palette.primary.light }} />
          <Typography
            variant="h3"
            fontSize={"16px"}
            color={theme.palette.primary.light}
          >
            Filters
          </Typography>
        </IconButton>
        {button && (
          <GreenButton
            onClick={handleBulkUpload}
            sx={{
              borderRadius: "2px",
            }}
            startIcon={<Upload />}
          >
            Upload New Members
          </GreenButton>
        )}
      </Box>
    </Box>
  );
};

export default UserToolbar;
