import { Stack, IconButton, Box } from "@mui/material";
import logo from "../../assets/images/header/logo.png";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const Header: React.FC = () => {
    return (
        <header>
            <Stack direction="row" justifyContent="space-between" alignItems="center"  px={"24px"}>
                <Box
                    component="img"
                    src={logo}
                    width={"85px"}
                    height={"auto"}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                    }}
                />
                <IconButton sx={{ color: "#fff" }}>
                    <NotificationsNoneOutlinedIcon/>
                </IconButton>
            </Stack>
        </header>
    );
};

export default Header;
