import { Box } from "@mui/material";
import React from "react";
import { VideoPlayerProps } from "../../Types/types";

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <Box
      sx={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "#000"
      }}
    >
      {/* Back Arrow Icon */}
      <Box
      sx={{
        position: "absolute",
        top: 24,
        left: 24,
        zIndex: 2,
        cursor: "pointer",
        color: "#fff",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        p: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={() => window.history.back()}
      >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      </Box>
      <iframe
      src={`https://www.youtube.com/embed/${videoUrl}`}
      title="YouTube video player"
      allowFullScreen
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
        position: "absolute"
      }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </Box>
  );
};
export default VideoPlayer;   