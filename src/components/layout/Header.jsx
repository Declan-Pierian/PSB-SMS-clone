import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import MegaMenu from './MegaMenu';
import UserMenu from './UserMenu';

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#b30537',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '64px !important',
          px: { xs: 1, sm: 2 },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            mr: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#fff',
                  fontSize: '1rem',
                  lineHeight: 1,
                }}
              >
                PSB
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  lineHeight: 1.2,
                  letterSpacing: '0.02em',
                }}
              >
                PSB Academy
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.65rem',
                  lineHeight: 1,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Student Management System
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Mega Menu - Center */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            flex: 1,
            justifyContent: 'center',
            overflow: 'visible',
          }}
        >
          <MegaMenu />
        </Box>

        {/* User Menu - Right */}
        <Box sx={{ flexShrink: 0 }}>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
