import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface ResourceRatingPulseProps {
  id: string;
  resourceId: string;
  resourceName: string;
  companyName: string;
  score: number;
  claimedAt: string;
  expiresAt: string;
  onAnswer?: (itemId: string, rating: number) => void;
  response?: number;
  smallSize?: boolean;
}

const ResourceRatingPulse: React.FC<ResourceRatingPulseProps> = ({
  id,
  //   resourceId,
  //   resourceName,
  companyName,
  //   score,
  //   claimedAt,
  //   expiresAt,
  onAnswer,
  response,
  smallSize = false,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const theme = useTheme();

  const handleStarClick = (rating: number) => {
    if (response !== undefined) return; // Already answered
    setSelectedRating(rating);
  };

  const handleStarHover = (rating: number) => {
    if (response !== undefined) return; // Already answered
    setHoveredRating(rating);
  };

  const handleStarHoverLeave = () => {
    if (response !== undefined) return; // Already answered
    setHoveredRating(0);
  };

  const handleSubmit = () => {
    if (selectedRating > 0 && onAnswer) {
      onAnswer(id, selectedRating);
    }
  };

  const isAnswered = response !== undefined;
  const displayRating = isAnswered ? response : hoveredRating || selectedRating;

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: "0px",
        boxShadow: "0px 4px 19px 0px #CD7BFF4D inset",
        border: `2px solid ${theme.palette.primary.main}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        pb: 0,
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "left",
          p: "0",
        }}
      >
        {/* Header */}
        <Box p={2}>
          <Typography
            variant="h6"
            sx={{
              fontSize: smallSize ? "16px" : "30px",
              fontWeight: 600,
              color: "black",
              marginBottom: "8px",
              lineHeight: 1.3,
            }}
          >
            Rate your experience with : {companyName}
          </Typography>
        </Box>

        {/* Star Rating */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= displayRating;
            return (
              <Box
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarHoverLeave}
                sx={{
                  cursor: isAnswered ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s ease",
                }}
              >
                {isFilled ? (
                  <StarIcon
                    sx={{
                      fontSize: smallSize ? "32px" : "45px",
                      color: `${theme.palette.primary.main}`, // Purple color for filled stars
                    }}
                  />
                ) : (
                  <StarBorderIcon
                    sx={{
                      fontSize: smallSize ? "32px" : "45px",
                      color: `${theme.palette.primary.main}`, // Light purple for empty stars
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Submit Button */}
        {!isAnswered && (
          <Button
            onClick={handleSubmit}
            disabled={selectedRating === 0}
            sx={{
              backgroundColor: "#CD7BFF4D",
              color: "black",
              borderTop: `1px solid ${theme.palette.primary.main}`,
              fontWeight: 600,
              fontSize: "30px",
              textTransform: "none",
              borderRadius: "0px",
              padding: smallSize ? "10px 24px" : "12px 32px",
              "&:hover": {
                backgroundColor: "#CD7BFF4D",
              },
              "&:disabled": {
                backgroundColor: "#CD7BFF4D",
                color: "#9E9E9E",
              },
            }}
          >
            Submit
          </Button>
        )}

        {/* Response Message */}
        {isAnswered && (
          <Typography
            variant="body2"
            sx={{
              color: "#4CAF50",
              fontWeight: 500,
              fontSize: smallSize ? "12px" : "14px",
            }}
          >
            Thank you for your rating!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceRatingPulse;
