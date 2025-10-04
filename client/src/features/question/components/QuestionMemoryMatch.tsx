import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
// import { v4 as uuid } from "uuid";
import matchPair from "../assets/matchPair.png";

interface MemoryTile {
  id: string;
  content: string;
  matchId: string;
  type: "text" | "image";
}

interface Props {
  id: string;
  questionText: string;
  memoryPairs: MemoryTile[];
  correctAnswer: string[];
  onAnswer: ( answer: string[],id: string) => void;
}

const QuestionMemoryMatch: React.FC<Props> = ({
  id,
  questionText,
  memoryPairs,
  onAnswer,
}) => {
  const theme=useTheme()
  const shuffled = useMemo(
    () => [...memoryPairs].sort(() => Math.random() - 0.5),
    []
  );
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [turns, setTurns] = useState(0);

  const handleFlip = (tile: MemoryTile) => {
    if (
      flipped.includes(tile.id) ||
      matched.includes(tile.id) ||
      flipped.length === 2
    )
      return;

    const newFlipped = [...flipped, tile.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map((id) =>
        shuffled.find((t) => t.id === id)
      );

      // Only proceed if both are found
      if (first && second) {
        setTimeout(() => {
          if (first.matchId === second.matchId) {
            setMatched((prev) => [...prev, first.id, second.id]);
          }
          setFlipped([]);
          setTurns((prev) => prev + 1);
        }, 1000);
      } else {
        // Fallback: reset flip if something went wrong
        setFlipped([]);
      }
    }
  };

  useEffect(() => {
    if (matched.length === memoryPairs.length) {
      onAnswer(matched,id);
    }
  }, [matched]);

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"} mb={3}>
        <Typography variant="h5" >
          {questionText}
        </Typography>
        <Typography sx={{textWrap:"nowrap"}}>Flips: {turns}</Typography>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
        {shuffled.map((tile) => {
          const isFlipped =
            flipped.includes(tile.id) || matched.includes(tile.id);
            const isMatched =  matched.includes(tile.id);
            return (
            <Box sx={{ perspective: "1000px" }}>
              <motion.div
              key={tile.id}
              onClick={() => handleFlip(tile)}
              whileTap={{ scale: 0.95 }}
              style={{
                display:"flex",
                width: "100%",
                height:"100%",
                backgroundColor: isMatched ? theme.palette.primary.main : "#D9D9D9",
                color: isMatched ? "white":"black",
                cursor: "pointer",
                textAlign: "center",
                alignItems:"center",
                justifyContent:"center",
                minHeight: "150px",
                margin:"auto",
                transformStyle: "preserve-3d",
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              >
              {isFlipped ? (
                tile.type === "text" ? (
                  <Typography sx={{transform: "rotateY(180deg)"}} display={"flex"} textAlign={"center"} px={"1"} >
                    {tile.content}
                  </Typography>
                ) : (
                  <img src={tile.content} alt="" width="100%"/>
                )
              ) : (
                <Box
                  component={"img"}
                  src={matchPair}
                  alt="??"
                  sx={{
                    width: "100%",
                  }}
                />
              )}
            </motion.div>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default QuestionMemoryMatch;
