import React, { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Upload, Image as ImageIcon } from '@mui/icons-material';

interface ImageUploadProps {
  value: string | File;
  onChange: (value: string | File) => void;
  label?: string;
  width?: number | string;
  height?: number | string;
  previewHeight?: number | string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Upload Image",
  width = "100%",
  height = 120,
  previewHeight = 100
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Pass the File object directly to onChange
      onChange(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Pass the File object directly to onChange
      onChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <Box>
      {label && (
        <Typography color="white" mb={1} fontSize="14px">
          {label}
        </Typography>
      )}
      <Box
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          width,
          height,
          backgroundColor: "#2A2A2A",
          border: `2px dashed ${dragOver ? "#A04AD4" : "#444"}`,
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#A04AD4",
            backgroundColor: "#333",
          },
        }}
      >
        {value ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={value instanceof File ? URL.createObjectURL(value) : value}
              alt="Preview"
              style={{
                maxHeight: previewHeight,
                maxWidth: "90%",
                objectFit: "contain",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "rgba(0,0,0,0.7)",
                borderRadius: "50%",
                p: 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Upload sx={{ color: "white", fontSize: 16 }} />
            </Box>
          </Box>
        ) : (
          <>
            <ImageIcon sx={{ color: "#666", fontSize: 40, mb: 1 }} />
            <Typography color="#666" fontSize="12px" textAlign="center">
              Click to upload or drag image here
            </Typography>
          </>
        )}
      </Box>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default ImageUpload;