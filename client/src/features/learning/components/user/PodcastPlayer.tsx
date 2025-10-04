import React, { useState, useRef, useEffect } from "react";
import { Stack, Typography, Box, IconButton, Slider } from "@mui/material";
import {
  PlayArrow,
  Pause,
  Replay10,
  Forward10,
  ArrowBack,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetModuleQuery } from "../../service/learningApi";
import Loader from "../../../../components/ui/Loader";
import CaptionDisplay from "./CaptionDisplay";
import AudioVisualizer from "./AudioVisualizer";

interface Caption {
  startTime: number;
  endTime: number;
  text: string;
}

interface AudioContent {
  audioUrl: string;
  captions: Caption[];
}

const PodcastPlayer: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { data: moduleData, isLoading } = useGetModuleQuery(moduleId || "");

  const audioContent = moduleData?.content as AudioContent;
  const captions = audioContent?.captions || [];

  // Format time in MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle seeking
  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        duration
      );
    }
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedData = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Navigate back to module or to assessment
    navigate(`/user/module/${moduleId}`);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadeddata", handleLoadedData);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadeddata", handleLoadedData);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!audioContent?.audioUrl) {
    return (
      <Stack p="20px" alignItems="center">
        <Typography>Audio content not found</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        height: "100vh",
        bgcolor: "#000",
        color: "white",
        maxWidth: "480px",
        margin: "0 auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: "20px 20px 10px 20px",
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: "white", mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          flex={1}
          textAlign="center"
          sx={{ fontSize: "18px", fontWeight: 500 }}
        >
          {moduleData?.title || "Podcast"}
        </Typography>
        <AudioVisualizer isPlaying={isPlaying} />
      </Stack>

      {/* Audio Element */}
      <audio ref={audioRef} src={audioContent.audioUrl} preload="metadata" />

      {/* Caption Display - Takes remaining space */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0, // Important for flex child to shrink
          px: "20px",
          py: "10px",
        }}
      >
        <CaptionDisplay captions={captions} currentTime={currentTime} />
      </Box>

      {/* Player Controls - Fixed at bottom */}
      <Stack
        spacing={2}
        sx={{
          p: "20px",
          flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)",
        }}
      >
        {/* Progress Bar */}
        <Stack spacing={1}>
          <Slider
            value={currentTime}
            min={0}
            max={duration || 100}
            onChange={(_, value) => handleSeek(value as number)}
            sx={{
              color: "primary.main",
              height: "6px",
              "& .MuiSlider-thumb": {
                width: 16,
                height: 16,
               
              },
              "& .MuiSlider-track": {
                height: 6,
                background: "primary.main",
              },
              "& .MuiSlider-rail": {
                height: 6,
                backgroundColor: "rgba(255,255,255,0.2)",
              },
            }}
          />
          <Stack direction="row" justifyContent="space-between">
            <Typography
              variant="caption"
              color="rgba(255,255,255,0.7)"
              sx={{ fontSize: "12px" }}
            >
              {formatTime(currentTime)}
            </Typography>
            <Typography
              variant="caption"
              color="rgba(255,255,255,0.7)"
              sx={{ fontSize: "12px" }}
            >
              {formatTime(duration)}
            </Typography>
          </Stack>
        </Stack>

        {/* Control Buttons */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={4}
          sx={{ pt: 1 }}
        >
          <IconButton
            onClick={skipBackward}
            sx={{
              color: "white",
              p: "12px",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.1)",
                color: "primary.main",
              },
            }}
          >
            <Replay10 sx={{ fontSize: "2.5rem" }} />
          </IconButton>

          <IconButton
            onClick={togglePlayPause}
            sx={{
              color: "#fff",
              fontSize: "2.5rem",
              bgcolor: "primary.main",
              p: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "primary.main",
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton
            onClick={skipForward}
            sx={{
              color: "white",
              // fontSize: "4rem",
              p: "12px",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.1)",
                color: "primary.main",
              },
            }}
          >
            <Forward10 sx={{ fontSize: "2.5rem" }} />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PodcastPlayer;
