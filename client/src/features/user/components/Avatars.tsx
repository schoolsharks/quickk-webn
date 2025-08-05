import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GlobalButton from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelectAvatarMutation } from "../userApi";

interface Avatar {
  src: string;
  _id: string;
}

interface AvatarProps {
  Avatars: Avatar[];
}

const Avatars: React.FC<AvatarProps> = ({ Avatars }) => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = React.useState<string | null>(
    null
  );

  const [selectAvatar] = useSelectAvatarMutation();

  const navigateBack = () => {
    window.history.back();
  };

  const handleSkip = () => {
    navigate("/user/dashboard");
  };

  const handleDone = () => {
    if (selectedAvatar) {
      selectAvatar({ avatarId: selectedAvatar })
        .unwrap()
        .then(() => {
          navigate("/user/dashboard");
        })
        .catch((error) => {
          console.error("Error selecting avatar:", error);
        });
    } else {
      alert("Please select an avatar before proceeding.");
    }
  };

  return (
    <Stack p={"70px 20px"} spacing={3} maxHeight={window.innerHeight}>
      {/* Header */}
      <Stack direction="row" alignItems="center" gap={1}>
        <IconButton sx={{ color: "text.primary" }} onClick={navigateBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h1" fontSize={"25px"}>
          Select an Avatar
        </Typography>
      </Stack>

      {/* Avatar Grid */}
      <Grid container justifyContent={"space-between"} rowGap={"10px"}>
        {Avatars.map((avatar, index) => (
          <Grid size={6} key={avatar._id}>
            <Box
              component="img"
              src={avatar.src}
              boxSizing={"border-box"}
              alt={`avatar-${index}`}
              onClick={() => setSelectedAvatar(avatar._id)}
              sx={{
                width: "100%",
                maxWidth: "90px",
                height: "130px",
                objectFit: "cover",
                cursor: "pointer",
                display: "block",
                margin: "0 auto",
                border:
                  selectedAvatar === avatar._id
                    ? "2px solid"
                    : "2px solid transparent",
                borderColor:
                  selectedAvatar === avatar._id
                    ? "primary.main"
                    : "transparent",
                transition: "border-color 0.2s",
                "&:hover": {
                  border: "2px solid",
                  borderColor: "primary.main",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Buttons */}
      <Box display="flex" flexDirection="row" gap={0}>
        <GlobalButton
          onClick={handleSkip}
          sx={{
            background: "rgba(70, 70, 70, 1)",
            width: "50%",
            color: "white",
          }}
        >
          Skip
        </GlobalButton>
        <GlobalButton onClick={handleDone} sx={{ width: "50%" }}>
          Done
        </GlobalButton>
      </Box>
    </Stack>
  );
};

export default Avatars;
