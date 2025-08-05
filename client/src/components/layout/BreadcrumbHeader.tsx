import React from "react";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  Button,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogoutAdminMutation } from "../../features/admin/service/adminApi";

interface BreadcrumbHeaderProps {
  showUserActions?: boolean;
}

const BreadcrumbHeader: React.FC<BreadcrumbHeaderProps> = ({
  showUserActions = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [LogoutAdmin] = useLogoutAdminMutation();

  // 🔥 Helpers to detect IDs and prettify labels
  const isId = (segment: string) => /^[0-9a-fA-F]{24}$/.test(segment);

  const prettify = (str: string) =>
    str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const pathnames = location.pathname.split("/").filter((x) => x);
  const filteredPathnames = pathnames.slice(1).filter((seg) => !isId(seg));

  const handleBreadcrumbClick = (to: string) => {
    navigate(to);
  };

  const handleSignOut = async () => {
    try {
      await LogoutAdmin({}).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/admin/login");
  };

  const title = prettify(
    filteredPathnames[filteredPathnames.length - 1] || "Home"
  );

  return (
    <Box
      sx={{
        background: "rgba(37, 37, 37, 1)",
        px: 3,
        pt: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "64px",
      }}
    >
      {/* Left - Breadcrumbs and Title */}
      <Box>
        <Breadcrumbs
          separator={
            <Typography sx={{ color: "white", fontSize: "12px" }}>/</Typography>
          }
          sx={{
            mb: 0.5,
            "& .MuiBreadcrumbs-ol": {
              alignItems: "center",
              justifyContent: "space-between",
            },
          }}
        >
          {filteredPathnames.map((segment, index) => {
            const to =
              "/" +
              pathnames
                .filter((seg) => !isId(seg))
                .slice(0, index + 2)
                .join("/");

            const isLast = index === filteredPathnames.length - 1;

            return isLast ? (
              <Typography
                key={to}
                sx={{
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                {prettify(decodeURIComponent(segment))}
              </Typography>
            ) : (
              <Link
                key={to}
                component="button"
                variant="body1"
                onClick={() => handleBreadcrumbClick(to)}
                sx={{
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 400,
                  textDecoration: "none",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {prettify(decodeURIComponent(segment))}
              </Link>
            );
          })}
        </Breadcrumbs>

        <Box display={"flex"} alignItems={"center"}>
          <IconButton
            aria-label="Go Back"
            onClick={() => navigate(-1)}
            sx={{
              color: "text.primary",
              mr: 1,
              mt: 1,
              p: 0.5,
              borderRadius: 0,
              my: "auto",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            my={"auto"}
            variant="h6"
            sx={{
              color: "text.primary",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Right - User Actions */}
      {showUserActions && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            sx={{
              color: "text.primary",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <NotificationsIcon sx={{ fontSize: "20px" }} />
          </IconButton>

          <Button
            startIcon={<LogoutIcon sx={{ fontSize: "16px" }} />}
            sx={{
              color: "text.primary",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BreadcrumbHeader;
