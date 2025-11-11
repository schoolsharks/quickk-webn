import { Stack, Box, useTheme } from "@mui/material";
import logo from "../../assets/images/header/logo.webp";
// import EventModeToggle from "../ui/EventMode";
import SidebarHamburger from "../../features/user/components/SidebarHamburger";

const Header: React.FC = () => {
  const theme = useTheme();
  return (
    <header>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px={"24px"}
      >
        <Box
          component="img"
          src={logo}
          border={`2px solid ${theme.palette.primary.main}`}
          borderRadius={"50%"}
          alt=""
          sx={{ width: "50px", height: "50px", objectFit: "cover" }}
        />

        {/* <EventModeToggle /> */}
        <SidebarHamburger />
      </Stack>
    </header>
  );
};

export default Header;
