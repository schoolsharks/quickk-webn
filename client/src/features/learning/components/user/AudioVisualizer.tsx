import React from 'react';
import { Box } from '@mui/material';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        height: '40px',
        opacity: isPlaying ? 1 : 0.3,
        transition: 'opacity 0.3s ease',
      }}
    >
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          sx={{
            width: '3px',
            height: '100%',
            backgroundColor: 'primary.main',
            borderRadius: '1.5px',
            animation: isPlaying ? `wave ${0.6 + index * 0.1}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${index * 0.1}s`,
            '@keyframes wave': {
              '0%': {
                height: '20%',
                backgroundColor: 'rgba(29, 185, 84, 0.5)',
              },
              '100%': {
                height: '100%',
                backgroundColor: 'primary.main',
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default AudioVisualizer;
