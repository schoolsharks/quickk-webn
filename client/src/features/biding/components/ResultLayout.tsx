import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Confetti from "react-confetti";
import TicketItem from "../../../components/ui/TicketItem";
import results from "../assets/results.webp";
import GlobalButton from "../../../components/ui/button";
import { motion } from "framer-motion";
import AnimateOnScroll from "../../../animation/AnimateOnScroll";
import { baseTransition } from "../../../animation/transitions/baseTransition";
import {
  bodyTextVariants,
  imageVariants,
  loserTicketVariants,
  loserTitleVariants,
  noteVariants,
  ticketVariants,
  titleVariants,
} from "../../../animation/variants/resultVariants";
import BottomNavigation from "../../../components/ui/BottomNavigation";

interface Ticket {
  tokenNumber: number;
  ticketCode: string;
  status: string;
  price?: number;
  rewardImage?: string;
  id?: string;
  reward?: string;
}

interface ResultProps {
  ticket: Ticket;
  user: object;
}

const ResultLayout: React.FC<ResultProps> = ({ ticket, user }) => {
  console.log(user);
  const [isWinner, setIsWinner] = useState(true);
  // winnerTicket?.user === "yourLoggedInUserId"; // Replace with real auth check

  const handleDownload = () => {
    if (isWinner) {
      setIsWinner(false);
    } else {
      setIsWinner(true);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      pt={"90px"}
      textAlign="center"
      component={motion.div}
      initial="hidden"
      animate="visible"
      overflow={"hidden"}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Box flex="1">
        {isWinner ? (
          <Box px={"20px"}>
            {/* Confetti Explosion */}
            <Box>
              <Confetti numberOfPieces={400} recycle={false} />
            </Box>

            {/* Image Animation */}
            <AnimateOnScroll variants={imageVariants}>
              <Box
                component={"img"}
                src={results}
                alt="Party Popper"
                sx={{
                  width: "150px",
                  height: "150px",
                  zIndex: "10",
                }}
              />
            </AnimateOnScroll>

            {/* Winner Animation */}
            <AnimateOnScroll
              variants={titleVariants}
              transition={baseTransition}
            >
              <Typography variant="h1" sx={{ textAlign: "center" }} mt={"70px"}>
                Congratulations!
              </Typography>
            </AnimateOnScroll>

            <AnimateOnScroll
              variants={bodyTextVariants}
              transition={baseTransition}
            >
              <Typography variant="body1" mb={2}>
                You've won the reward for your token number!
              </Typography>
            </AnimateOnScroll>

            <GlobalButton onClick={handleDownload}>Download List</GlobalButton>

            <AnimateOnScroll
              variants={noteVariants}
              transition={baseTransition}
            >
              <Typography fontSize={"10px"} fontWeight={400}>
                Note: All the winners will get a confirmation mail on their
                registered email id.
              </Typography>
            </AnimateOnScroll>

            <AnimateOnScroll
              variants={ticketVariants}
              transition={baseTransition}
            >
              <Box mt={2}>
                <TicketItem ticket={ticket} />
              </Box>
            </AnimateOnScroll>
          </Box>
        ) : (
          <Box px="20px">
            <AnimateOnScroll
              variants={loserTitleVariants}
              transition={baseTransition}
            >
              <Typography variant="h1" sx={{ textAlign: "center" }} mt={"70px"}>
                Better luck Next Time!
              </Typography>
            </AnimateOnScroll>

            <Typography variant="body1" mb={2}>
              The winners for this round have been announced.
            </Typography>

            <GlobalButton onClick={handleDownload}>Download List</GlobalButton>

            <AnimateOnScroll
              variants={loserTicketVariants}
              transition={baseTransition}
            >
              <Box mt={4}>
                <TicketItem ticket={ticket} />
              </Box>
            </AnimateOnScroll>
          </Box>
        )}
      </Box>
      <Box>
        <BottomNavigation active={"home"} />
      </Box>
    </Box>
  );
};

export default ResultLayout;
