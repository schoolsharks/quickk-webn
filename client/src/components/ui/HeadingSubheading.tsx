import React from 'react';
import { Box, Typography } from '@mui/material';

interface HeadingSubheadingProps {
  heading: string;
  subheading: string;
}

const HeadingSubheading: React.FC<HeadingSubheadingProps> = ({
  heading,
  subheading,
}) => {
  return (
    <Box>
      <Typography
        variant="body1"
        fontWeight={600}
        fontSize="14px"
        color="black"
        lineHeight={1.2}
      >
        {heading}
      </Typography>
      <Typography
        variant="body2"
        fontSize="12px"
        color="gray"
        lineHeight={1.2}
        mt={0.5}
      >
        {subheading}
      </Typography>
    </Box>
  );
};

export default HeadingSubheading;