import {
  Box,
  Typography,
  useTheme,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBack, FiberManualRecord } from "@mui/icons-material";
import GlobalButton from "../../../components/ui/button";

const GetListed = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePayClick = () => {
    // Handle payment logic here
    console.log("Payment initiated");
  };

  const benefits = [
    "Appear in our community directory.",
    "Reach entrepreneurs, investors, and business owners.",
    "Build trust and credibility within the network.",
    "Get discovered by potential customers & collaborators.",
  ];

  return (
    <Box
      sx={{
        maxWidth: "480px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        position: "relative",
        padding: "0 24px",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px 0",
          marginBottom: "32px",
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            marginRight: "16px",
          }}
        >
          <ArrowBack sx={{ color: "#000" }} />
        </IconButton>
        <Typography
          variant="h2"
          sx={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#000",
          }}
        >
          Get Listed
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ marginBottom: "40px" }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#000",
            lineHeight: 1.2,
          }}
        >
          Want to Get Listed on Our Platform?
        </Typography>

        <Typography
          sx={{
            fontSize: "16px",
            color: theme.palette.text.secondary,
            lineHeight: "18px",
            marginBottom: "32px",
          }}
        >
          Showcase yourself or your business to our entire community. Getting
          listed means more visibility, more connections, and more
          opportunities.
        </Typography>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ marginBottom: "40px" }}>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: theme.palette.primary.main,
            marginBottom: "16px",
          }}
        >
          Benefits of Listing
        </Typography>

        <List sx={{ padding: 0 }}>
          {benefits.map((benefit, index) => (
            <ListItem
              key={index}
              sx={{
                padding: "2px 0",
                alignItems: "flex-start",
              }}
            >
              <ListItemIcon sx={{ minWidth: "20px", marginTop: "8px" }}>
                <FiberManualRecord
                  sx={{
                    fontSize: "8px",
                    color: "#000",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={benefit}
                sx={{
                  margin: 0,
                  "& .MuiListItemText-primary": {
                    fontSize: "16px",
                    color: "#000",
                    lineHeight: 1.5,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Listing Fee Section */}
      <Box sx={{ marginBottom: "60px" }}>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: theme.palette.primary.main,
            marginBottom: "8px",
          }}
        >
          Listing Fee
        </Typography>

        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#000",
          }}
        >
          ₹200 only
        </Typography>
      </Box>

      {/* Pay Button */}
      {/* <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "480px",
          padding: "16px 24px 32px",
          backgroundColor: "#FFFFFF",
        }}
      > */}
      <GlobalButton
        onClick={handlePayClick}
        fullWidth={true}
        sx={{
          backgroundColor: "#4A4A4A",
          color: "#FFFFFF",
          marginBottom: "30px",
          "&:hover": {
            backgroundColor: "#3A3A3A",
          },
        }}
      >
        Pay
      </GlobalButton>
      {/* </Box> */}
    </Box>
  );
};

export default GetListed;
