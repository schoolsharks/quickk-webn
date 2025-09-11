import React, { useRef, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ChevronRight, Check } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface InfiniteCarouselProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  sx?: object;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  children,
  hasMore,
  loading,
  onLoadMore,
  sx = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(trigger);

    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  // Smooth scroll functions
  const scrollLeft = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollLeft();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollLeft, scrollRight]);

  return (
    <Box sx={{ position: "relative", ...sx }}>
      {/* Left Navigation Button */}
      {/* <IconButton
        onClick={scrollLeft}
        sx={{
          position: 'absolute',
          left: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          bgcolor: 'white',
          boxShadow: 2,
          border: `1px solid ${theme.palette.grey[200]}`,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-50%) scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
        aria-label="Scroll left"
      >
        <ChevronLeft />
      </IconButton> */}

      {/* Right Navigation Button */}
      {/* <IconButton
        onClick={scrollRight}
        sx={{
          position: 'absolute',
          right: 8,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          bgcolor: 'white',
          boxShadow: 2,
          border: `1px solid ${theme.palette.grey[200]}`,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-50%) scale(1.05)',
          },
          transition: 'all 0.2s ease',
        }}
        aria-label="Scroll right"
      >
        <ChevronRight />
      </IconButton> */}

      {/* Carousel Container */}
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          px: 6,
          py: 0,
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Edge
          },
        }}
      >
        {children}

        {/* Loading indicator and infinite scroll trigger */}
        {hasMore && (
          <Box
            ref={loadMoreTriggerRef}
            sx={{
              flexShrink: 0,
              width: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
              >
                <CircularProgress
                  size={32}
                  sx={{ color: theme.palette.primary.main }}
                />
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                >
                  Loading more recommendations...
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 80,
                  bgcolor: theme.palette.grey[50],
                  border: `2px dashed ${theme.palette.grey[300]}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box textAlign="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mx: "auto",
                      mb: 1.5,
                      bgcolor: theme.palette.grey[200],
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight sx={{ color: theme.palette.grey[400] }} />
                  </Box>
                  <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                  >
                    Scroll to load more
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {!hasMore && !loading && (
          <Box
            sx={{
              flexShrink: 0,
              width: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box textAlign="center" py={4}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  mx: "auto",
                  mb: 1.5,
                  bgcolor: theme.palette.success.light + "20",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check sx={{ color: theme.palette.success.main }} />
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                color={theme.palette.text.primary}
              >
                You've seen all recommendations!
              </Typography>
              <Typography
                variant="caption"
                color={theme.palette.text.secondary}
                mt={0.5}
              >
                Refresh the page for new suggestions
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Scroll indicators */}
      {/* <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 0.5,
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              bgcolor: theme.palette.grey[300],
              borderRadius: '50%',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </Box> */}
    </Box>
  );
};

export default InfiniteCarousel;
