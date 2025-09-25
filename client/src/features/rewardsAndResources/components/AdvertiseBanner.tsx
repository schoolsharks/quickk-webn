import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { StarsOutlined } from "@mui/icons-material";

const AdvertiseBanner: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#CD7BFF4D",
      }}
    >
      <Box padding={"14px"}>
        <Typography fontWeight={"400"} fontSize={"16px"} color="primary.main">
          Prime reward
        </Typography>
        <Typography
          fontWeight={"700"}
          fontSize={"25px"}
          lineHeight={"120%"}
          marginTop={"10px"}
        >
          Advertise Your Business.
          <br /> Shine in the Spotlight.
        </Typography>
        <Typography fontWeight={"400"} fontSize={"12px"} color="#404040">
          Every star you earn brings you closer to visibility. Advertise your
          story, your business, your journey to the community.
        </Typography>
      </Box>
      <Button
        fullWidth
        sx={{
          borderRadius: "0",
          marginTop: "24px",
          bgcolor: "#404040",
          color: "#fff",
          fontSize: "25px",
          gap:"8px"
        }}
      >
        Use 1000{" "}
        <StarsOutlined sx={{ fontSize: "28px" }} />
      </Button>
    </Box>
  );
};

export default AdvertiseBanner;
