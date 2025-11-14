import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
// import starsEarnedBg from "../../assets/images/stars-earned-popup-bg.webp";
import { Close, StarsOutlined } from "@mui/icons-material";

interface StarsEarnedPopupProps {
  open: boolean;
  stars: number;
  onClose?: () => void;
}
const StarsEarnedPopup = ({ open, stars, onClose }: StarsEarnedPopupProps) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "480px",
          margin: "0 auto",
        },
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <Box
        sx={{
          // background: `url(${starsEarnedBg})`,
          background: "linear-gradient(#FFF 0%, #F0D7FF 100%)",
          textAlign: "center",
          // backgroundSize: "100% 100%",
          // backgroundRepeat: "no-repeat",
          paddingBottom:"60px"
        }}
      >
        <Stack direction={"row-reverse"}>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
        <Typography fontSize={"25px"} fontWeight={"900"} color="primary.main" marginTop={"24px"}>
          Congratulations!
        </Typography>
        <Typography fontSize={"16px"} fontWeight={"600"} color="primary.main">
          You have earned
        </Typography>
        <Stack direction="row" justifyContent={"center"} alignItems={"center"} marginTop={"8px"}>
          <Typography fontSize="50px" fontWeight={"800"} color="#000000">
            {stars}
          </Typography>
          <StarsOutlined  sx={{ fontSize: "50px",color:"#000" }} />
        </Stack>
        <Typography marginTop={"8px"} color="#000000">
          Keep earning stars to<br/> unlock rewards!
        </Typography>
      </Box>
    </Drawer>
  );
};

export default StarsEarnedPopup;
