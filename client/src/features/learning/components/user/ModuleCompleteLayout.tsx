import React, { useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArticleIcon from "@mui/icons-material/Article";
import MenuBookIcon from "@mui/icons-material/MenuBook";
// import QemojiImage from "./Qemoji";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../../theme/theme";
import { Mic } from "@mui/icons-material";

interface ModuleCompleteProps {
  points: number;
  duration: string;
  recommendations?: {
    name: string;
    type: "video" | "article" | "book" | "podcast";
    url?: string;
  }[];
  onNextModule?: () => void;
  onHomeClick?: () => void;
}

const ModuleCompleteLayout: React.FC<ModuleCompleteProps> = ({
  points,
  duration = "10 mins",
  recommendations = [],
  onNextModule,
  onHomeClick,
}) => {
  const navigate = useNavigate();

  const navigateToRewards = () => {
    navigate("/user/reward");
  };
  const navigateToLeaderboard = () => {
    navigate("/user/leaderboard");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Stack
      sx={{
        // color: "white",
        height:"100%",
        flex: 1,
        alignContent: "space-between",
        pt: 4,
        position: "relative",
      }}
    >
      <Box
        mx={"auto"}
        sx={{
          padding: "0 24px",
        }}
      >
        {/* Main content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // pt: 4,
            pb: 4,
          }}
        >
          {/* <QemojiImage width="148px" height="148px" /> */}

          <Typography variant="h2" mt={"52px"}>
            Module complete!
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "32px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.primary.main,
              }}
            >
              <Typography variant="h6" fontSize={"25px"}>
                {points}
              </Typography>
              <StarsOutlinedIcon sx={{ ml: 1, fontSize: 25 }} />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: theme.palette.primary.main,
              }}
            >
              <Typography variant="h6" fontSize={"25px"}>
                {duration}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Box ml={0} mt={2}>
            <Typography variant="subtitle2" sx={{ color: "#888888", mb: 1 }}>
              Recommendations:
            </Typography>

            {recommendations.map((rec, index) => (
              <Box
                key={index}
                onClick={() => {
                  if (rec.url) {
                    window.open(rec.url, "_blank");
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  cursor: "pointer",
                }}
              >
                {rec.type === "video" && (
                  <YouTubeIcon sx={{ mr: 1, fontSize: 20 }} />
                )}
                {rec.type === "article" && (
                  <ArticleIcon sx={{ mr: 1, fontSize: 20 }} />
                )}
                {rec.type === "book" && (
                  <MenuBookIcon sx={{ mr: 1, fontSize: 20 }} />
                )}
                {rec.type === "podcast" && <Mic sx={{ mr: 1, fontSize: 20 }} />}
                <Typography variant="body1">{rec.name}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Navigation buttons */}
      <Box
        sx={{ mt: "52px", position: "absolute", bottom: "0", width: "100%" }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              bgcolor: "#D9D9D9",
              color: "#000000",
              flex: 1,
              p: "21px",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={onHomeClick}
          >
            <HomeIcon />
            <Typography variant="h5" sx={{ mt: 1 }}>
              Home
            </Typography>
          </Box>

          <Box
            sx={{
              background: theme.palette.text.secondary,
              color: "white",
              flex: 1,
              p: "21px",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={onNextModule}
          >
            <ArrowForwardIcon />
            <Typography sx={{ mt: 1 }}>Next Module</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              background: theme.palette.text.secondary,
              flex: 1,
              p: "21px",
              display: "flex",
              cursor: "pointer",
              flexDirection: "column",
              color:"#fff"
            }}
            onClick={navigateToLeaderboard}
          >
            <LeaderboardIcon />
            <Typography sx={{ mt: 1 }}>Leaderboard</Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#D9D9D9",
              flex: 1,
              p: "21px",
              display: "flex",
              cursor: "pointer",
              flexDirection: "column",
            }}
            onClick={navigateToRewards}
          >
            <CardGiftcardIcon />
            <Typography sx={{ mt: 1 }}>Rewards</Typography>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default ModuleCompleteLayout;
