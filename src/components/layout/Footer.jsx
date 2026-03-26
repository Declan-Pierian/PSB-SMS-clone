import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        px: 3,
        py: 1.5,
        backgroundColor: 'transparent',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: '#aaa',
          fontSize: '0.72rem',
          fontWeight: 400,
          letterSpacing: '0.02em',
        }}
      >
        Powered by ConceptWaves
      </Typography>
    </Box>
  );
};

export default Footer;
