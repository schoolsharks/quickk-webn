import React from "react";
import { Typography, IconButton, Stack } from "@mui/material";
import { ArrowBack, InfoOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Stack direction={"row"} justifyContent={"space-between"} padding={"20px 0"}>
      <Stack direction="row" alignItems="center" px={"12px"}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack sx={{color:"#000",fontSize:"20px"}}/>
        </IconButton>
        <Typography variant="h1" fontSize={"20px"}>
          Rewards & Resources
        </Typography>
      </Stack>
      <IconButton>
        <InfoOutlined sx={{color:"#000"}}/>
      </IconButton>
    </Stack>
  );
};

export default TopBar;
