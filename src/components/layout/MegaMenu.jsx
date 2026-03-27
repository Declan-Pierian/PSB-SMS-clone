import React, { useState, useRef, useMemo } from 'react';
import { Box, Button, Paper, Popover, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/Folder';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import menuConfig from '../../data/menuConfig';
import { useAuth } from '../../contexts/AuthContext';

// Map icon string names to actual MUI icon components
const iconMap = {
  Folder: FolderIcon,
  AttachMoney: AttachMoneyIcon,
  School: SchoolIcon,
  BarChart: BarChartIcon,
  MenuBook: MenuBookIcon,
  Settings: SettingsIcon,
  People: PeopleIcon,
  Dashboard: DashboardIcon,
  Assignment: AssignmentIcon,
  Receipt: ReceiptIcon,
  Event: EventIcon,
  Notifications: NotificationsIcon,
  Home: HomeIcon,
};

const getIcon = (iconName) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent sx={{ fontSize: 18 }} /> : <FolderIcon sx={{ fontSize: 18 }} />;
};

const MegaMenuDropdown = ({ menuItem, anchorEl, open, onClose }) => {
  const groups = menuItem?.groups || [];

  // Determine number of columns based on group count
  const columnCount = Math.min(groups.length, 4);
  const gridSize = 12 / (columnCount || 1);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5,
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)',
            minWidth: columnCount > 2 ? 680 : columnCount > 1 ? 480 : 280,
            maxWidth: 900,
            overflow: 'hidden',
          },
        },
      }}
      disableRestoreFocus
      sx={{
        pointerEvents: 'none',
        '& .MuiPopover-paper': {
          pointerEvents: 'auto',
        },
      }}
    >
      <Box
        onMouseLeave={onClose}
        sx={{ p: 2.5 }}
      >
        {/* Menu Title Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            pb: 1.5,
            borderBottom: '2px solid #b30537',
          }}
        >
          {menuItem.icon && getIcon(menuItem.icon)}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#b30537',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {menuItem.label}
          </Typography>
        </Box>

        {/* Groups Grid */}
        <Grid container spacing={3}>
          {groups.map((group, groupIndex) => (
            <Grid size={{ xs: 12, sm: gridSize }} key={groupIndex}>
              <Box>
                {/* Group Title */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    mb: 0.5,
                    px: 1,
                    py: 0.5,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    borderLeft: '3px solid #b30537',
                  }}
                >
                  {group.title}
                </Typography>

                {/* Group Items */}
                <List dense disablePadding sx={{ mt: 0.5 }}>
                  {group.items.map((item, itemIndex) => (
                    <ListItemButton
                      key={itemIndex}
                      component={RouterLink}
                      to={item.path}
                      onClick={onClose}
                      sx={{
                        borderRadius: '6px',
                        py: 0.6,
                        px: 1,
                        mb: 0.2,
                        minHeight: 'unset',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(179, 5, 55, 0.06)',
                          '& .MuiListItemIcon-root': {
                            color: '#b30537',
                          },
                          '& .MuiListItemText-primary': {
                            color: '#b30537',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 30,
                          color: '#888',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {item.icon ? getIcon(item.icon) : getIcon('Folder')}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.82rem',
                          fontWeight: 500,
                          color: '#444',
                          lineHeight: 1.3,
                          transition: 'color 0.15s ease',
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Popover>
  );
};

const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const closeTimeoutRef = useRef(null);
  const { permissions } = useAuth();

  // Filter menu based on user role
  const filteredMenu = useMemo(() => {
    if (!permissions || !permissions.filterMenu) return menuConfig;
    return permissions.filterMenu(menuConfig);
  }, [permissions]);

  const handleMenuOpen = (event, index) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setAnchorEl(event.currentTarget);
    setActiveMenu(index);
  };

  const handleMenuClose = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setAnchorEl(null);
    }, 150);
  };

  const handleMenuCloseImmediate = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveMenu(null);
    setAnchorEl(null);
  };

  const handleButtonMouseEnter = (event, index) => {
    handleMenuOpen(event, index);
  };

  const handleButtonMouseLeave = () => {
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {filteredMenu.map((menuItem, index) => (
        <Box
          key={index}
          onMouseEnter={(e) => handleButtonMouseEnter(e, index)}
          onMouseLeave={handleButtonMouseLeave}
        >
          <Button
            sx={{
              color: '#fff',
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: activeMenu === index ? 600 : 500,
              px: 1.5,
              py: 1,
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              backgroundColor: activeMenu === index ? 'rgba(255,255,255,0.15)' : 'transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
              },
            }}
            endIcon={
              menuItem.groups && menuItem.groups.length > 0 ? (
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: '18px !important',
                    transition: 'transform 0.2s ease',
                    transform: activeMenu === index ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              ) : null
            }
          >
            {menuItem.label}
          </Button>

          {menuItem.groups && menuItem.groups.length > 0 && (
            <MegaMenuDropdown
              menuItem={menuItem}
              anchorEl={anchorEl}
              open={activeMenu === index}
              onClose={handleMenuCloseImmediate}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default MegaMenu;