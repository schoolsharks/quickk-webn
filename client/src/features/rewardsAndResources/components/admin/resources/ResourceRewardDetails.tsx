import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface DescriptionSection {
  title: string;
  points: string[];
}

interface ResourceRewardDetailsProps {
  description: DescriptionSection[];
  onDescriptionChange: (description: DescriptionSection[]) => void;
}

const ResourceRewardDetails: React.FC<ResourceRewardDetailsProps> = ({
  description,
  onDescriptionChange,
}) => {
  // Handle description point changes
  const handleDescriptionChange = (
    sectionIndex: number,
    pointIndex: number,
    value: string
  ) => {
    const updatedDescription = description.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            points: section.points.map((point, j) =>
              j === pointIndex ? value : point
            ),
          }
        : section
    );
    onDescriptionChange(updatedDescription);
  };

  // Add new point to description section
  const addDescriptionPoint = (sectionIndex: number) => {
    const updatedDescription = description.map((section, i) =>
      i === sectionIndex
        ? { ...section, points: [...section.points, ""] }
        : section
    );
    onDescriptionChange(updatedDescription);
  };

  // Remove a point from description section
  const removeDescriptionPoint = (sectionIndex: number, pointIndex: number) => {
    const updatedDescription = description.map((section, i) =>
      i === sectionIndex
        ? {
            ...section,
            points: section.points.filter((_, j) => j !== pointIndex),
          }
        : section
    );
    onDescriptionChange(updatedDescription);
  };

  return (
    <Box sx={{ backgroundColor: "#F0D7FF", p: 3 }}>
      <Typography variant="h6" color="black" mb={2}>
        Reward Details
      </Typography>

      {description.map((section, sectionIndex) => (
        <Box key={sectionIndex} mb={3}>
          {/* Static section title - not editable */}
          <Typography color="black" mb={2} fontSize="16px" fontWeight="500">
            {section.title}
          </Typography>

          {section.points.map((point, pointIndex) => (
            <Box key={pointIndex} mb={1} display={"flex"}>
              <TextField
                fullWidth
                multiline
                value={point}
                placeholder={`Enter ${section.title.toLowerCase()} point...`}
                onChange={(e) =>
                  handleDescriptionChange(sectionIndex, pointIndex, e.target.value)
                }
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 0,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                  },
                  "& .MuiInputBase-input": { color: "black" },
                  mb: 1,
                }}
              />
              {section.points.length > 1 && (
                <Box display="flex" justifyContent="flex-end" mb={1}>
                  <IconButton
                    onClick={() => removeDescriptionPoint(sectionIndex, pointIndex)}
                    sx={{ 
                      color: "#fff", 
                      minWidth: "auto", 
                      px: 2,
                      borderRadius: 0,
                    }}
                  >
                    <Close sx={{fontSize:"16px"}}/>
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}

          <Button
            onClick={() => addDescriptionPoint(sectionIndex)}
            sx={{ 
              color: "#A04AD4", 
              mb: 2,
              borderRadius: 0,
              fontSize: "14px",
            }}
          >
            Add +
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default ResourceRewardDetails;