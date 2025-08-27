import { Stack, Box } from "@mui/material";
import logo from "../../assets/images/header/logo.webp";
import EventModeToggle from "../ui/EventMode";

const Header: React.FC = () => {
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
          width={"50px"}
          height={"auto"}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        />

        <EventModeToggle />
        
      </Stack>
    </header>
  );
};

export default Header;
