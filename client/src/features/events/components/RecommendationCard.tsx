import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { Add, Person } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface RecommendationUser {
  _id: string;
  name: string;
  businessName: string;
  businessLogo?: string;
  businessCategory?: string;
  specialisation?: string;
  chapter?: string;
  instagram?: string;
  facebook?: string;
  contact?: string;
  companyMail: string;
  avatar?: string;
  matchScore: number;
}

interface RecommendationCardProps {
  user: RecommendationUser;
  onActionClick: (
    user: RecommendationUser,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  user,
  onActionClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage =
    user.businessLogo && !imageError ? user.businessLogo : user.avatar;

  return (
    <Card
      sx={{
        minWidth: 300,
        maxWidth: 320,
        border: `1px solid ${theme.palette.primary.main}`,
        flexShrink: 0,
        borderRadius: 0,
        transition: "all 0.3s ease",
      }}
    >
      <CardContent sx={{ p: 1 }}>
        {/* User Avatar/Logo */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          //   mb={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                // background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                p: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                src={displayImage}
                alt={user.name}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: "white",
                }}
                onError={handleImageError}
              >
                {!displayImage && (
                  <Person sx={{ color: theme.palette.grey[400] }} />
                )}
              </Avatar>
            </Box>

            <Box flex={1}>
              <Typography
                variant="h6"
                fontWeight={600}
                fontSize="18px"
                color={theme.palette.text.primary}
                noWrap
                title={user.name}
              >
                {user.name.length > 10
                  ? `${user.name.slice(0, 10)}...`
                  : user.name}
              </Typography>
              <Typography
                variant="body2"
                color={theme.palette.text.secondary}
                fontSize="14px"
                // noWrap
                title={`${user.businessName}${
                  user.businessCategory ? ` (${user.businessCategory})` : ""
                }`}
              >
                {user.businessName.length > 15
                  ? `${user.businessName.slice(0, 15)}...`
                  : user.businessName}{" "}
                {user.businessCategory &&
                  (user.businessCategory.length > 10
                    ? `(${user.businessCategory.slice(0, 10)}...)`
                    : `(${user.businessCategory})`)}
              </Typography>
            </Box>
          </Box>

          {/* Action Button */}
          <IconButton
            onClick={(event) => onActionClick(user, event)}
            aria-label="Connect with user"
          >
            <Add sx={{ color: theme.palette.primary.main, fontSize: 25 }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
