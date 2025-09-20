import React from "react";
import { Box } from "@mui/material";
import EventsAdminLayout from "../components/admin/EventsAdminLayout";
import { useNavigate } from "react-router-dom";

const EventsAdminPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    // Navigate to create event page
    navigate("/admin/events/new");
  };

  const handleEditEvent = (eventId: string) => {
    // Navigate to edit event page
    navigate(`/admin/events/${eventId}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        color: "black",
      }}
    >
      <EventsAdminLayout
        onCreateEvent={handleCreateEvent}
        onEditEvent={handleEditEvent}
      />
    </Box>
  );
};

export default EventsAdminPage;
