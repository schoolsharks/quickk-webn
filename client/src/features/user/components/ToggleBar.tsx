import React from "react";
import { Box } from "@mui/material";
// import DarkModeToggle from "../../../components/ui/DarkModeToggle";
import LanguageToggle from "../../../components/ui/LanguageToggle";

const ToggleBar: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      mt={2}
    >
      {/* Dark Mode */}
      {/* <Box>
        <DarkModeToggle active={true} />
      </Box> */}

      {/* Language */}
      <Box>
        <LanguageToggle active={false} />
      </Box>
    </Box>
  );
};

export default ToggleBar;
