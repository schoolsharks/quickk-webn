import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArticleIcon from "@mui/icons-material/Article";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QemojiImage from "./Qemoji";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { useNavigate } from "react-router-dom";
import { theme } from "../../../../theme/theme";

interface ModuleCompleteProps {
  points: number;
  duration: string;
  recommendations?: {
    title: string;
    type: "video" | "blog" | "book";
    author?: string;
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
    navigate("/user/reward")};
  const navigateToLeaderboard = () => {
    navigate("/user/leaderboard");
  }
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <Box
      sx={{
        color: "white",
        display: "flex",
        flexDirection: "column",
        p: "110px 0px  26px 0px",
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
          pt: 4,
          pb: 4,
        }}
      >
        <QemojiImage width="148px" height="148px" />

        <Typography variant="h2" mt={"52px"}>
          Module complete!
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: "32px",
            width: "55%",
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

      {/* Navigation buttons */}
      <Box sx={{ mt: "52px", mb:"32px" }}>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
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
              background: "rgba(37, 37, 37, 1)",
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
              background: "rgba(37, 37, 37, 1)",
              flex: 1,
              p: "21px",
              display: "flex",
              cursor: "pointer",
              flexDirection: "column",
            }}
            onClick={navigateToLeaderboard}
          >
            <LeaderboardIcon />
            <Typography sx={{ mt: 1 }}>Leaderboard</Typography>
          </Box>

          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
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

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Box mx={"auto"}>
          <Typography variant="subtitle2" sx={{ color: "#888888", mb: 1 }}>
            Recommendations:
          </Typography>

          {recommendations.map((rec, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              {rec.type === "video" && (
                <YouTubeIcon sx={{ mr: 1, fontSize: 20 }} />
              )}
              {rec.type === "blog" && (
                <ArticleIcon sx={{ mr: 1, fontSize: 20 }} />
              )}
              {rec.type === "book" && (
                <MenuBookIcon sx={{ mr: 1, fontSize: 20 }} />
              )}
              <Typography variant="body1">
                {rec.title}
                {rec.author ? ` by ${rec.author}` : ""}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ModuleCompleteLayout;
