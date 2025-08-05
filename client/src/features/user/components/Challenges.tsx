import React from 'react';
import { Stack, Box, Typography, useTheme } from '@mui/material';

const Challenges: React.FC = () => {
    const theme = useTheme();

    return (
        <Stack direction="row" mt={3} borderRadius="4px" overflow="visible">
            <Box flex={1} bgcolor={theme.palette.primary.main} p={1.5}>
                <Typography fontSize={22} fontWeight="bold">15</Typography>
                <Typography>Learnings</Typography>
            </Box>
            <Box flex={1} bgcolor="#3B3B3B" p={1.5}>
                <Typography fontSize={22} fontWeight="bold">01</Typography>
                <Typography>Challenges</Typography>
            </Box>
        </Stack>
    );
};

export default Challenges;