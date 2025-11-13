import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CloneIcon,
  Event as EventIcon,
} from "@mui/icons-material";

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description?: string;
    eventImage?: string;
    status: string;
    startDate: string;
    endDate: string;
    location?: string;
    isVirtual: boolean;
    interestedCount: number;
    attendedCount?: number;
    organizer?: string;
    createdAt: string;
  };
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  onClone?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
  onClone,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "primary.main";
      case "upcoming":
        return "#bfb5ff";
      case "past":
        return "#bfb5ff";
      case "draft":
        return "#bfb5ff";
      default:
        return "#bfb5ff";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#F0D7FF",
        border: "1px solid #e0e0e0",
        borderRadius: "0px",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Event Image */}
      <Box p={2}>
        <Box
          sx={{
            height: 200,
            position: "relative",
            backgroundColor: "#f5f5f5",
            backgroundImage: event.eventImage
              ? `url(${event.eventImage})`
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Status Badge */}
          <Chip
            label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: getStatusColor(event.status),
              color:
                event.status.toLowerCase() === "upcoming" ? "black" : "black",
              fontSize: "12px",
              borderRadius: "0px",
            }}
          />

          {/* Menu Button */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>

          {/* Default Event Icon if no image */}
          {!event.eventImage && (
            <EventIcon
              sx={{ fontSize: 60, color: "rgba(255, 255, 255, 0.8)" }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, color: "black" }}>
        {/* Event Title */}
        <Typography
          variant="h4"
          component="div"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {event.title}
        </Typography>

        {/* Event Date & Time */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="body2">
            {formatDate(event.startDate)} & {formatTime(event.startDate)}
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="body2">
            {event.isVirtual ? "Online Event" : event.location || "TBA"}
          </Typography>
        </Box>

        {/* Attendees Count */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2" color="primary">
            {event.interestedCount} applied
          </Typography>
        </Box>
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 150 },
        }}
      >
        {onEdit && (
          <MenuItem
            onClick={() => {
              onEdit(event._id);
              handleMenuClose();
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: 20 }} />
            Edit
          </MenuItem>
        )}
        {onClone && (
          <MenuItem
            onClick={() => {
              onClone(event._id);
              handleMenuClose();
            }}
          >
            <CloneIcon sx={{ mr: 1, fontSize: 20 }} />
            Clone
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={() => {
              onDelete(event._id);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default React.memo(EventCard);
