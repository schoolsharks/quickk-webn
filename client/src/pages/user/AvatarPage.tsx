import { Box, Typography } from "@mui/material";
import Avatars from "../../features/user/components/Avatars";
import { useGetAllAvatarsQuery } from "../../features/user/userApi";
import Loader from "../../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const AvatarPage = () => {
  const {
    data: avatars,
    isLoading: avatarsLoading,
    isError: avatarsError,
  } = useGetAllAvatarsQuery({});
  const { avatarSelected } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  // 🚫 Redirect immediately if avatar already selected
  useEffect(() => {
    if (avatarSelected) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [avatarSelected, navigate]);

  // 🔒 Don't render anything if avatar is already selected
  if (avatarSelected) return null;

  if (avatarsLoading) {
    return <Loader />;
  }

  if (avatarsError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Typography color="error">
          Failed to load avatars or user data.
        </Typography>
      </Box>
    );
  }

  return <Avatars Avatars={avatars} />;
};

export default AvatarPage;
