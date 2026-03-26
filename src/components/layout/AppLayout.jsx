import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AppLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f6fa',
      }}
    >
      {/* Fixed Header */}
      <Header />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          pt: '70px', // offset for fixed AppBar
          pb: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            flex: 1,
            py: 2,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default AppLayout;
