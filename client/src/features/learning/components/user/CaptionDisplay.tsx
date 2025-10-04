import React, { useMemo, useRef, useEffect } from "react";
import { Typography, Box } from "@mui/material";

interface Caption {
  startTime: number;
  endTime: number;
  text: string;
}

interface Word {
  text: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
  isPassed: boolean;
}

interface CaptionDisplayProps {
  captions: Caption[];
  currentTime: number;
}

const CaptionDisplay: React.FC<CaptionDisplayProps> = ({
  captions,
  currentTime,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Merge all captions into a full transcript with word-level timing
  const fullTranscript = useMemo(() => {
    const words: Word[] = [];

    captions.forEach((caption) => {
      const captionWords = caption.text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (captionWords.length === 0) return;

      const wordDuration =
        (caption.endTime - caption.startTime) / captionWords.length;

      captionWords.forEach((word, index) => {
        const wordStartTime = caption.startTime + index * wordDuration;
        const wordEndTime = caption.startTime + (index + 1) * wordDuration;

        words.push({
          text: word,
          startTime: wordStartTime,
          endTime: wordEndTime,
          isActive: false,
          isPassed: false,
        });
      });
    });

    return words;
  }, [captions]);

  // Update word states based on current time
  const processedWords = useMemo(() => {
    return fullTranscript.map((word) => ({
      ...word,
      isActive: currentTime >= word.startTime && currentTime <= word.endTime,
      isPassed: currentTime > word.endTime,
    }));
  }, [fullTranscript, currentTime]);

  // Find the currently active word index
  const activeWordIndex = processedWords.findIndex((word) => word.isActive);

  // Auto-scroll to keep the active word in view
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeWord = activeWordRef.current;

      // Get positions
      const containerRect = container.getBoundingClientRect();
      const wordRect = activeWord.getBoundingClientRect();

      // Calculate if we need to scroll
      const containerCenter = containerRect.height / 2;
      const wordCenter = wordRect.top - containerRect.top + wordRect.height / 2;

      // Smooth scroll to keep active word in the center
      if (Math.abs(wordCenter - containerCenter) > 50) {
        const scrollOffset = wordCenter - containerCenter;
        container.scrollBy({
          top: scrollOffset,
          behavior: "smooth",
        });
      }
    }
  }, [activeWordIndex]);

  // Group words into paragraphs for better readability
  const paragraphs = useMemo(() => {
    const WORDS_PER_PARAGRAPH = 40; // Adjust as needed
    const paragraphGroups = [];

    for (let i = 0; i < processedWords.length; i += WORDS_PER_PARAGRAPH) {
      paragraphGroups.push(processedWords.slice(i, i + WORDS_PER_PARAGRAPH));
    }

    return paragraphGroups;
  }, [processedWords]);

  if (fullTranscript.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          No transcript available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        height: "100%",
        overflowY: "auto",
        px: 3,
        py: 4,
        position: "relative",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      {/* Add top padding so first words can scroll to center */}
      <Box sx={{ height: "40vh" }} />

      {paragraphs.map((paragraph, paragraphIndex) => (
        <Box
          key={paragraphIndex}
          sx={{
            mb: 5,
            lineHeight: 1.8,
            textAlign: "left",
          }}
        >
          {paragraph.map((word, wordIndex) => {
            const globalWordIndex = paragraphIndex * 40 + wordIndex;
            const isActiveWord = word.isActive;

            return (
              <Typography
                key={globalWordIndex}
                component="span"
                ref={isActiveWord ? activeWordRef : undefined}
                sx={{
                  fontSize: "22px",
                  fontWeight: 400,
                  marginRight: "10px",
                  transition: "all 0.4s ease-in-out",
                  color: "white",
                  opacity: word.isPassed ? 1 : word.isActive ? 1 : 0.4,
                  display: "inline-block",
                  cursor: "default",
                  letterSpacing: "0.5px",
                }}
              >
                {word.text}
              </Typography>
            );
          })}
        </Box>
      ))}

      {/* Add bottom padding so last words can scroll to center */}
      <Box sx={{ height: "40vh" }} />
    </Box>
  );
};

export default CaptionDisplay;
