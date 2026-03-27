import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const auth = useAuth();

  const user = auth?.user || { name: 'Admin User', role: 'Administrator' };
  const userName = user.name || 'User';
  const userRole = user.roleLabel || user.role || 'Staff';

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleClose();
    if (auth?.logout) {
      auth.logout();
    }
    navigate('/login');
  };

  const menuItems = [
    {
      label: 'Home',
      icon: <HomeIcon fontSize="small" />,
      path: '/dashboard',
      onClick: () => handleNavigate('/dashboard'),
    },
    {
      label: 'My Profile',
      icon: <PersonIcon fontSize="small" />,
      path: '/profile',
      onClick: () => handleNavigate('/profile'),
    },
    {
      label: 'Change Password',
      icon: <LockIcon fontSize="small" />,
      path: '/profile/change-password',
      onClick: () => handleNavigate('/profile/change-password'),
    },
    {
      label: 'My References',
      icon: <BookmarkIcon fontSize="small" />,
      path: '/profile/references',
      onClick: () => handleNavigate('/profile/references'),
    },
  ];

  return (
    <Box>
      {/* User Button */}
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          borderRadius: '8px',
          px: 1.5,
          py: 0.5,
          transition: 'all 0.2s ease',
          backgroundColor: open ? 'rgba(255,255,255,0.15)' : 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.12)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: '0.8rem',
            fontWeight: 700,
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          {getInitials(userName)}
        </Avatar>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.82rem',
              lineHeight: 1.2,
            }}
          >
            {userName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.68rem',
              lineHeight: 1,
            }}
          >
            {userRole}
          </Typography>
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 18,
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)',
              overflow: 'visible',
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                borderLeft: '1px solid rgba(0,0,0,0.06)',
                borderTop: '1px solid rgba(0,0,0,0.06)',
              },
            },
          },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 1.5, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                fontSize: '0.95rem',
                fontWeight: 700,
                backgroundColor: '#b30537',
                color: '#fff',
              }}
            >
              {getInitials(userName)}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#333', lineHeight: 1.3 }}
              >
                {userName}
              </Typography>
              <Chip
                label={userRole}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(179, 5, 55, 0.08)',
                  color: '#b30537',
                  mt: 0.3,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={item.onClick}
            sx={{
              py: 1,
              px: 2,
              mx: 0.5,
              borderRadius: '6px',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: 'rgba(179, 5, 55, 0.06)',
                '& .MuiListItemIcon-root': {
                  color: '#b30537',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#666', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            />
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5 }} />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1,
            px: 2,
            mx: 0.5,
            borderRadius: '6px',
            transition: 'all 0.15s ease',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
              '& .MuiListItemIcon-root': {
                color: '#d32f2f',
              },
              '& .MuiListItemText-primary': {
                color: '#d32f2f',
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: '#666', minWidth: 36 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
