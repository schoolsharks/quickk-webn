import React, { useState, useCallback } from "react";
import { Box, Typography, Alert, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useLazyGetUserRecommendationsQuery } from "../../user/userApi";
import RecommendationCard from "./RecommendationCard";
import ActionMenu from "./ActionMenu";
import InfiniteCarousel from "./InfiniteCarousel";

interface RecommendationUser {
  _id: string;
  name: string;
  businessName: string;
  businessLogo?: string;
  businessCategory?: string;
  specialisation?: string;
  chapter?: string;
  instagram?: string;
  facebook?: string;
  contact?: string;
  companyMail: string;
  avatar?: string;
  matchScore: number;
}

interface RecommendationResponse {
  success: boolean;
  data: {
    recommendations: RecommendationUser[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasMore: boolean;
      total: number;
      limit: number;
    };
    meta: {
      algorithm: string;
      refreshToken: string;
      matchingCriteria: {
        chapter?: string;
        businessCategory?: string;
        specialisation?: string;
      };
    };
  };
}

const Recommendation: React.FC = () => {
  const theme = useTheme();
  const currentUser = useSelector((state: RootState) => state.user);
  const [recommendations, setRecommendations] = useState<RecommendationUser[]>(
    []
  );
  const [pagination, setPagination] = useState({
    currentPage: 0,
    hasMore: true,
    total: 0,
  });
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<RecommendationUser | null>(
    null
  );
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(
    null
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const [getRecommendations, { isLoading, isError }] =
    useLazyGetUserRecommendationsQuery();

  // Initialize recommendations on component mount
  React.useEffect(() => {
    loadRecommendations(1, true);
  }, []);

  const loadRecommendations = useCallback(
    async (page: number, reset: boolean = false) => {
      try {
        const params: any = {
          page,
          limit: 10,
        };

        // Use existing refresh token for pagination consistency
        if (!reset && refreshToken) {
          params.refreshToken = refreshToken;
        }

        const result = (await getRecommendations(
          params
        ).unwrap()) as RecommendationResponse;

        if (result.success) {
          // Filter out current user as additional safety check
          const newRecommendations = result.data.recommendations.filter(
            (user) => user._id !== currentUser.userId
          );

          // Log for debugging
          if (process.env.NODE_ENV === "development") {
            console.log(
              `Filtered ${
                result.data.recommendations.length - newRecommendations.length
              } current user entries from recommendations`
            );
            console.log(`Current user ID: ${currentUser.userId}`);
          }

          if (reset) {
            setRecommendations(newRecommendations);
            setRefreshToken(result.data.meta.refreshToken);
          } else {
            setRecommendations((prev) => [...prev, ...newRecommendations]);
          }

          setPagination({
            currentPage: result.data.pagination.currentPage,
            hasMore: result.data.pagination.hasMore,
            total: result.data.pagination.total,
          });
        }
      } catch (error) {
        console.error("Error loading recommendations:", error);
        setSnackbar({
          open: true,
          message: "Failed to load recommendations. Please try again.",
          severity: "error",
        });
      }
    },
    [getRecommendations, refreshToken]
  );

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !isLoading) {
      loadRecommendations(pagination.currentPage + 1, false);
    }
  }, [
    loadRecommendations,
    pagination.hasMore,
    pagination.currentPage,
    isLoading,
  ]);

  const handleActionClick = useCallback(
    (user: RecommendationUser, event: React.MouseEvent<HTMLButtonElement>) => {
      setSelectedUser(user);
      setActionMenuAnchor(event.currentTarget);
    },
    []
  );

  const handleActionMenuClose = useCallback(() => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshToken("");
    setRecommendations([]);
    setPagination({ currentPage: 0, hasMore: true, total: 0 });
    loadRecommendations(1, true);

    setSnackbar({
      open: true,
      message: "Recommendations refreshed successfully!",
      severity: "success",
    });
  }, [loadRecommendations]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  if (isError && recommendations.length === 0) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={handleRefresh}
            >
              Retry
            </Typography>
          }
        >
          Failed to load recommendations. Please check your connection and try
          again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box pb={2}>
      {/* Header */}
      <Box p={3} pb={1}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography
            variant="h2"
            color={theme.palette.text.primary}
            fontSize="20px"
            fontWeight={700}
          >
            Suggestions for you
          </Typography>
          {/* <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              color: theme.palette.primary.main,
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={handleRefresh}
          >
            Refresh
          </Typography> */}
        </Box>

        {/* {pagination.total > 0 && (
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {recommendations.length} of {pagination.total} recommendations
          </Typography>
        )} */}
      </Box>

      {/* Recommendations Carousel */}
      <InfiniteCarousel
        hasMore={pagination.hasMore}
        loading={isLoading}
        onLoadMore={handleLoadMore}
        sx={{ height: 100, mt: 2 }}
      >
        {recommendations.map((user) => (
          <RecommendationCard
            key={user._id}
            user={user}
            onActionClick={handleActionClick}
          />
        ))}
      </InfiniteCarousel>

      {/* No recommendations message */}
      {recommendations.length === 0 && !isLoading && !isError && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={8}
          px={3}
        >
          <Typography variant="h6" color={theme.palette.text.secondary} mb={2}>
            No recommendations available right now
          </Typography>
          <Typography
            variant="body2"
            color={theme.palette.text.secondary}
            textAlign="center"
          >
            We're working on finding the best matches for you. Check back later!
          </Typography>
        </Box>
      )}

      {/* Action Menu */}
      {selectedUser && (
        <ActionMenu
          user={selectedUser}
          anchorEl={actionMenuAnchor}
          onClose={handleActionMenuClose}
        />
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Recommendation;
