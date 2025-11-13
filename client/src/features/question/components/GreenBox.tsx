import { Box } from "@mui/material";
import React from "react";

const GreenBox: React.FC = () => {
  const rows = [
    [
      "#F0D7FF",
      "#F0D7FF",
      "#F0D7FF",
      "#BFB5FF",
      "#F0D7FF",
      "#F0D7FF",
      "#F0D7FF",
      "#F0D7FF",
      "#BFB5FF",
      "#BFB5FF",
      "#BFB5FF",
    ],
    [
      "#F0D7FF",
      "#BFB5FF",
      "#BFB5FF",
      "#F0D7FF",
      "#F0D7FF",
      "#BFB5FF",
      "#BFB5FF",
      "#BFB5FF",
      "#F0D7FF",
      "#F0D7FF",
      "#F0D7FF",
    ],
  ];

  return (
    <Box display="flex" flexDirection="column" gap="3px" width="100%">
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex} display="flex" width="100%" gap="3px">
          {row.map((shade, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                background: shade,
                position: "relative",
                "&:after": {
                  content: '""',
                  display: "block",
                  paddingBottom: "100%", // This creates the 1:1 aspect ratio
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default GreenBox;
