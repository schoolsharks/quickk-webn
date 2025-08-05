import { Box, Button, Typography } from "@mui/material";
import React from "react";
import results from "../../features/biding/assets/results.webp";
import { useNavigate } from "react-router-dom";
import { useGetLastPastRewardQuery } from "../../features/biding/service/bidingApi";
import Loader from "./Loader";

const ResultsAnounced: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: ResultReward,
    isLoading,
    error,
  } = useGetLastPastRewardQuery({});

  if (isLoading) {
    return <Loader />;
  }


  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "20vh",
          bgcolor: "background.default",
          p: 2,
        }}
      >
        <Typography color="error">
          Failed to load Results.
        </Typography>
      </Box>
    );
  }
  const naviagteWinner = () => {
    navigate(`/user/result/${ResultReward.lastPastReward._id}`);
  };
  return (
    <Button
      fullWidth
      onClick={naviagteWinner}
      sx={{
        // mt: "18px",
        display: "flex",
        borderRadius: "0",
        p: "0",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "white",
        color: "black",
      }}
    >
      <Box
        component="img"
        src={ResultReward?.lastPastReward.image}
        alt={"Live reward"}
        sx={{
          width: "80px",
          height: "60px",
          objectFit: "cover",
        }}
      />
      <Box
        display={"flex"}
        flex={1}
        gap={2}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Typography variant="h5" fontSize={22}>
          Result announced
        </Typography>
        <Box
          component="img"
          src={results}
          alt={"Result announced"}
          sx={{
            maxWidth: "32px",
            maxHeight: "32px",
            objectFit: "cover",
          }}
        />
      </Box>
    </Button>
  );
};

export default ResultsAnounced;
