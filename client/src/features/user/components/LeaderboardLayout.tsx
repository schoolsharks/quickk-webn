import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { theme } from "../../../theme/theme";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import AnimateOnScroll from "../../../animation/AnimateOnScroll";
import { fadeInUp } from "../../../animation";
import { baseTransition } from "../../../animation/transitions/baseTransition";

interface Leaderboard {
  users: Array<{
    name: string;
    totalStars: number;
    time: string;
    avatar?: string;
  }>;
  currentMonth: string;
  currentYear: number;
}

interface LeaderboardLayoutProps {
  leaderboardData: Leaderboard;
}

const LeaderboardLayout: React.FC<LeaderboardLayoutProps> = ({
  leaderboardData,
}) => {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("user/dashboard");
  };
  const { name } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sort users by totalStars in descending order and take the top 6
  const sortedUsers = [...leaderboardData.users]
    .sort((a, b) => b.totalStars - a.totalStars)
    .slice(0, 10);

  const topThree = sortedUsers.slice(0, 3).map((user, index) => ({
    rank: index + 1,
    ...user,
  }));
  const podiumOrder = [topThree[2], topThree[0], topThree[1]];

  const restOfUsers = sortedUsers.slice(3);

  return (
    <Box
      sx={{
        color: "#fff",
        minHeight: window.innerHeight,
        p: "50px 20px",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton edge="start" color="inherit" onClick={navigateHome}>
          <ArrowBackIcon />
        </IconButton>
        <Typography fontWeight="bold" fontSize={"25px"} ml={1}>
          Leaderboard
        </Typography>
      </Box>

      {/* Month Indicator */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          py: "4px",
          px: 2,
          textAlign: "right",
        }}
      >
        <Typography variant="body1" fontWeight={600} color="black">
          Month - {leaderboardData.currentMonth}, {leaderboardData.currentYear}
        </Typography>
      </Box>

      {/* Top 3 Podium */}
      <Box
        display="flex"
        mb="18px"
        gap={"10px"}
        alignItems="flex-end"
        mt={"56px"}
        width={"100%"}
      >
        {podiumOrder.map((user, index) => {
          const podiumStyles = [
            { height: 180, background: "rgba(209, 209, 214, 1)" }, // #3
            { height: 330, backgroundColor: theme.palette.primary.main }, // #1
            { height: 260, background: "rgba(70, 70, 70, 1)" }, // #2
          ];

          return (
            <Box textAlign="center" flex={1} key={index}>
              <Typography
                fontSize={"25px"}
                fontWeight="bold"
                textAlign={"left"}
              >
                #{user.rank}
              </Typography>
              <Box
                sx={{
                  ...podiumStyles[index],
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <Box
                  bgcolor={"white"}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 60,
                      height: 90,
                      borderRadius: "0",
                    }}
                  />
                </Box>
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Typography color={index === 2 ? "inherit" : "black"}>
                    {user.name}
                  </Typography>
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    <Typography
                      fontSize="14px"
                      color={index === 2 ? "inherit" : "black"}
                      sx={{
                        textWrap: "nowrap",
                      }}
                    >
                      {user.totalStars}{" "}
                      <StarsOutlinedIcon
                        sx={{ fontSize: 12, verticalAlign: "middle" }}
                      />
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Leaderboard List */}
      <List disablePadding>
        {restOfUsers.map((user, index) => {
          const isHighlight = user.name === name;
          return (
            <AnimateOnScroll
              variants={fadeInUp}
              transition={baseTransition}
              amount={0.2}
            >
              <ListItem
                key={index}
                sx={{
                  p: "0",
                  mb: 1,
                  gap: "6px",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: isHighlight ? "#96FF43" : "#333",
                    color: isHighlight ? "#000" : "#fff",
                    p: "5px",
                  }}
                >
                  <Typography>{String(index + 4).padStart(2, "0")}</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: isHighlight ? "#96FF43" : "#333",
                    color: isHighlight ? "#000" : "#fff",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: "1",
                    alignItems: "center",
                    px: 1,
                  }}
                >
                  <ListItemText
                    primary={user.name}
                    sx={{
                      ".MuiTypography-root": { fontWeight: 500 },
                    }}
                  />
                  <Typography sx={{ minWidth: 60 }}>{user.time}</Typography>
                  <Typography sx={{ minWidth: 50 }}>
                    {user.totalStars}{" "}
                    <StarsOutlinedIcon
                      sx={{ fontSize: 14, verticalAlign: "middle" }}
                    />
                  </Typography>
                </Box>
              </ListItem>
            </AnimateOnScroll>
          );
        })}
      </List>
    </Box>
  );
};

export default LeaderboardLayout;
