import React, { useEffect } from "react";
import {
  Box,
  Typography,
  // Avatar,
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
    businessLogo?: string;
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

  // Users are already sorted and limited to top 10 from server
  const sortedUsers = leaderboardData.users;

  const topThree = sortedUsers.slice(0, 3).map((user, index) => ({
    rank: index + 1,
    ...user,
  }));
  const podiumOrder = [topThree[2], topThree[0], topThree[1]];

  const restOfUsers = sortedUsers.slice(3);

  return (
    <Box
      sx={{
        color: "black",
        minHeight: window.innerHeight,
        p: "30px 25px",
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
          backgroundColor: theme.palette.text.secondary,
          py: "4px",
          px: 2,
          textAlign: "right",
        }}
      >
        <Typography variant="body1" fontWeight={600} color="white">
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
          const isHighlight = user.name === name;

          const podiumStyles = [
            {
              height: 180,
              background: isHighlight ? "#CD7BFF80" : "#00000040",
            }, // #3
            {
              height: 330,
              backgroundColor: isHighlight ? "#CD7BFF80" : "#00000033",
            }, // #1
            {
              height: 260,
              background: isHighlight ? "#CD7BFF80" : "#4040409C",
            }, // #2
          ];

          return (
            <Box textAlign="center" key={index} flex={1}>
              <Typography
                fontSize={"25px"}
                fontWeight="bold"
                textAlign={"left"}
              >
                #{user.rank}
              </Typography>
              <Box
                border={
                  isHighlight
                    ? `2px solid ${theme.palette.primary.main}`
                    : "none"
                }
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
                  <img
                    src={user?.businessLogo}
                    alt={user.name.charAt(0).toUpperCase()}
                    style={{
                      width: "100%",
                      height: 90,
                      objectFit: "contain",
                      background: "white",
                      color: "#333",
                      borderRadius: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/70?text=" +
                        user.name.charAt(0).toUpperCase();
                    }}
                  />
                </Box>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                  // justifyContent={"space-between"}
                >
                  <Typography
                    color={index === 2 ? "inherit" : "black"}
                    fontSize="14px"
                    mt={1}
                  >
                    {user.name}
                  </Typography>
                  <Box display={"flex"} alignItems={"center"} gap={1}>
                    <Typography
                      ml={"4px"}
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
                    backgroundColor: isHighlight ? "#333" : "transparent",
                    color: !isHighlight ? "#000" : "#fff",
                    border: `1px solid  ${theme.palette.primary.main}`,
                    p: "5px",
                  }}
                >
                  <Typography fontWeight={800}>
                    {String(index + 4).padStart(2, "0")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: isHighlight ? "#333" : "transparent",
                    color: !isHighlight ? "#000" : "#fff",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flex: "1",
                    alignItems: "center",
                    border: `1px solid  ${theme.palette.primary.main}`,
                    px: 1,
                  }}
                >
                  <ListItemText
                    primary={user.name}
                    sx={{
                      ".MuiTypography-root": { fontWeight: 500 },
                    }}
                  />
                  {/* <Typography sx={{ minWidth: 60 }}>{user.time}</Typography> */}
                  <Typography sx={{ minWidth: 50 }}>
                    {user.totalStars}{" "}
                    {isHighlight ? (
                      <StarsOutlinedIcon
                        sx={{
                          fontSize: 18,
                          verticalAlign: "middle",
                          color: theme.palette.primary.main,
                        }}
                      />
                    ) : (
                      <></>
                    )}
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
