import React, { useState } from "react";
import { Box, Typography, IconButton, Tabs, Tab, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TicketItem from "../../../components/ui/TicketItem";
import AnimateOnScroll from "../../../animation/AnimateOnScroll";
import { fadeInUp } from "../../../animation";
import { baseTransition } from "../../../animation/transitions/baseTransition";

interface Ticket {
  id: string;
  tokenNumber: number;
  status: string;
  price: number;
  ticketCode: string;
  rewardImage: string;
}

interface MyTicketsLayoutProps {
  currentTickets: Ticket[];
  pastTickets: Ticket[];
}

export const MyTicketsLayout: React.FC<MyTicketsLayoutProps> = ({
  currentTickets,
  pastTickets,
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: window.innerHeight,
        width: "100%",
        color: "text.primary",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => window.history.back()}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ ml: 1 }}>
            My Tickets
          </Typography>
        </Box>
        <IconButton color="inherit">
          <InfoOutlinedIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="inherit"
        sx={{
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTab-root": {
            color: "text.primary",
            bgcolor: "#222222",
            py: 1.5,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "black",
            },
          },
        }}
      >
        <Tab label="Current" />
        <Tab label="Past" />
      </Tabs>

      {/* Ticket List */}
      <Box sx={{ p: 2 }}>
        {tabValue === 0 ? (
          <Stack spacing={2}>
            {currentTickets.map((ticket) => (
              <AnimateOnScroll variants={fadeInUp} transition={baseTransition} amount={0.3}>
                <TicketItem key={ticket.id} ticket={ticket} />
              </AnimateOnScroll>
            ))}
          </Stack>
        ) : (
          <Stack spacing={2}>
            {pastTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyTicketsLayout;
