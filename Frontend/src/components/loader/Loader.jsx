import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const Loader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress size={80} color="primary" />
      <Typography variant="h6" mt={3}>
        Loading...
      </Typography>
    </Box>
  );
};

export default Loader;
