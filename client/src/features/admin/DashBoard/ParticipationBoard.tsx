import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface Participant {
  id: string;
  rank: number;
  name: string;
  percentage: number;
  avatar?: string;
}

// Mock data - replace with your actual data
const mockParticipants: Participant[] = [
  {
    id: "1",
    rank: 1,
    name: "Ujjwal Kwatra",
    percentage: 98,
    avatar: "https://quickk.s3.ap-south-1.amazonaws.com/avatar1.webp",
  },
  {
    id: "2",
    rank: 2,
    name: "Vidhi Chawla",
    percentage: 95,
    avatar: "https://quickk.s3.ap-south-1.amazonaws.com/avatar2.webp",
  },
  {
    id: "3",
    rank: 3,
    name: "Raj Mishra",
    percentage: 93,
    avatar: "https://quickk.s3.ap-south-1.amazonaws.com/avatar3.webp",
  },
  {
    id: "4",
    rank: 4,
    name: "Hardik Kapoor",
    percentage: 88,
    avatar: "https://quickk.s3.ap-south-1.amazonaws.com/avatar4.webp",
  },
  {
    id: "5",
    rank: 5,
    name: "Mishri Sinha",
    percentage: 80,
    avatar: "https://quickk.s3.ap-south-1.amazonaws.com/avatar5.webp",
  },
  {
    id: "6",
    rank: 6,
    name: "Rahul Pandey",
    percentage: 89,
    avatar: "https://quickk.s3.ap-south-1.amazonaws.com/avatar1.webp",
  },
];

const ParticipationBoard: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [participants] = useState<Participant[]>(mockParticipants);

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //   const handleDownload = (participant: Participant) => {
  //     // Implement download functionality
  //     console.log("Download for:", participant.name);
  //   };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        p: "24px",
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

        {/* Search Bar */}
        <TextField
          name="Search"
          placeholder="Search"
          variant="standard"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mt: 0,
            p: 0,
            "& .MuiInputBase-root": {
              borderRadius: "0",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.paper,
              borderRadius: 0,
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.text.secondary,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Box>

      {/* Participants List */}
      <List sx={{ p: 0, mt: "24px" }}>
        {filteredParticipants.map((participant) => (
          <ListItem
            key={participant.id}
            sx={{
              p: 0,
              mb: "20px",
              backgroundColor:
                participant.rank === 1
                  ? theme.palette.primary.main
                  : participant.rank <= 3
                  ? theme.palette.background.paper
                  : "black",
              border: participant.rank > 3 ? "1px solid #FFFFFF80" : "none",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={participant.avatar}
                alt={participant.name}
                sx={{
                  borderRadius: 0,
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.text.primary,
                  color: theme.palette.background.default,
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                {!participant.avatar && participant.name[0]}
              </Avatar>
            </ListItemAvatar>

            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color:
                    participant.rank === 1
                      ? theme.palette.background.default
                      : theme.palette.text.primary,
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
                      : theme.palette.text.primary,
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
                      : theme.palette.text.primary,
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
                      : theme.palette.text.primary,
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
