import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  useTheme,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useGetParticipationLeaderboardQuery } from "../service/adminApi";

interface Participant {
  id: string;
  rank: number;
  name: string;
  percentage: number;
  businessLogo?: string;
  businessName?: string;
}

const ParticipationBoard: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, _setSearchQuery] = useState("");

  // Fetch real participation leaderboard data
  const {
    data: participationResponse,
    isLoading,
    error,
  } = useGetParticipationLeaderboardQuery({});

  // Fallback data in case of error
  const fallbackParticipants: Participant[] = [
    {
      id: "1",
      rank: 1,
      name: "Ujjwal Kwatra",
      percentage: 98,
      businessLogo: "",
    },
    {
      id: "2",
      rank: 2,
      name: "Vidhi Chawla",
      percentage: 95,
      businessLogo: "",
    },
    {
      id: "3",
      rank: 3,
      name: "Raj Mishra",
      percentage: 93,
      businessLogo: "",
    },
  ];

  // Use real data if available, otherwise use fallback
  const participants = participationResponse?.data || fallbackParticipants;

  const filteredParticipants = participants.filter((participant: Participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //   const handleDownload = (participant: Participant) => {
  //     // Implement download functionality
  //     console.log("Download for:", participant.name);
  //   };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        p: "24px",
        border: `1px solid ${theme.palette.primary.main}`,
        height: "100%",
        minHeight: 500,
      }}
    >
      {/* Header */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
            }}
          >
            Participation Board
          </Typography>

          <IconButton
            sx={{
              p: 0,
              color: theme.palette.text.primary,
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Participants List */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            mt: "24px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            mt: "24px",
            flexDirection: "column",
          }}
        >
          <Typography variant="body1" color="error" sx={{ mb: 1 }}>
            Failed to load participation data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing fallback data
          </Typography>
        </Box>
      ) : null}

      <List sx={{ p: 0, mt: "24px" }}>
        {filteredParticipants.map((participant: Participant) => (
          <ListItem
            key={participant.id}
            sx={{
              p: 0,
              mb: "20px",
              backgroundColor:
                participant.rank === 1
                  ? theme.palette.primary.main
                  : participant.rank <= 3
                  ? "#444444"
                  : "#0D0D0D",
              border: participant.rank > 3 ? "1px solid #FFFFFF80" : "none",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={participant.businessLogo}
                alt={participant.name}
                sx={{
                  borderRadius: 0,
                  width: 40,
                  height: 40,
                  bgcolor: "#FFFFFF",
                  color: theme.palette.background.default,
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                {!participant.businessLogo && participant.name[0]}
              </Avatar>
            </ListItemAvatar>

            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color:
                    participant.rank === 1
                      ? theme.palette.background.default
                      : "white",
                  fontSize: "16px",
                  // minWidth: 40,
                }}
              >
                #{participant.rank}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color:
                    participant.rank === 1
                      ? theme.palette.background.default
                      : "white",
                  fontSize: "16px",
                  flex: 1,
                  ml: 2,
                }}
              >
                {participant.name}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color:
                    participant.rank === 1
                      ? theme.palette.background.default
                      : "white",
                  fontSize: "16px",
                  mr: 2,
                }}
              >
                {participant.percentage}%
              </Typography>

              <IconButton
                sx={{
                  color:
                    participant.rank === 1
                      ? theme.palette.background.default
                      : "white",
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ParticipationBoard;
