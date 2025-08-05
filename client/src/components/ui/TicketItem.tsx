import { Box, Typography } from '@mui/material';
import React from 'react'
import greenTicket from "../../features/biding/assets/ticketGreen.png";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import whiteTicket from "../../features/biding/assets/Subtract.png";


interface Ticket {
  tokenNumber: number;
  ticketCode: string;
  status: string;
  price?: number;
  rewardImage?: string;
  id?: string;
  reward?: string;
  user?: string;
}

interface TicketItemProps {
  ticket: Ticket;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
  return (
    <Box sx={{ display: "flex", gap: "1px", position: "relative" }}>
      {/* Green Ticket */}
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={greenTicket}
          alt="Green Ticket"
          sx={{
            width: "100%",
            height: "150px",
            objectFit: "contain",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-90deg)",
            transformOrigin: "center",
            color: "#000",
            fontWeight: 600,
            fontSize: "16px",
            whiteSpace: "nowrap",
          }}
        >
          Ticket {ticket.price}{" "}
          <StarsOutlinedIcon sx={{ ml: 0.5, fontSize: "16px" }} />
        </Box>
      </Box>

      {/* White Ticket */}
      <Box sx={{ position: "relative", flexGrow: 1 }}>
        <Box
          component="img"
          src={whiteTicket}
          alt="White Ticket"
          sx={{
            width: "100%",
            height: "150px",
            objectFit: "fill",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "16px",
            gap: "30px",
            p: "18px 10px",
          }}
        >
          {/* Ticket Image */}
          <Box
            component="img"
            src={ticket.rewardImage}
            alt={`Ticket ${ticket.tokenNumber}`}
            sx={{
              width: "95px",
              height: "110px",
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
          {/* Ticket Info */}
          <Box >
            <Typography
              fontSize={"25px"}
              textAlign={"left"}
              sx={{ fontWeight: 800, color: "#000" }}
            >
              {ticket.tokenNumber}
            </Typography>
            <Typography
              variant="h4"
              sx={{ color: "#000", fontSize: "16px" }}
            >
              Token number
            </Typography>
            <Typography
              variant="h6"
              textAlign={"left"}
              sx={{ color: "#000", fontSize: "14px", mt: 1, textWrap: "nowrap" }}
            >
              Status - {ticket.status}
            </Typography>
            <Typography
            textAlign={"left"}
              variant="h6"
              sx={{ color: "#666", fontSize: "8px" }}
            >
              Ticket code - {ticket.ticketCode}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketItem