import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function PageHeader({ title, breadcrumbs = [], action, actionLabel, actionIcon, onAction }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
          {title}
        </Typography>
        {action || (actionLabel && onAction) ? (
          action || (
            <Button
              variant="contained"
              startIcon={actionIcon}
              onClick={onAction}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              {actionLabel}
            </Button>
          )
        ) : null}
      </Box>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ fontSize: '0.85rem' }}>
          <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit" sx={{ fontSize: '0.85rem' }}>
            Home
          </Link>
          {breadcrumbs.map((crumb, i) =>
            i === breadcrumbs.length - 1 ? (
              <Typography key={i} color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                {crumb.label}
              </Typography>
            ) : (
              <Link key={i} component={RouterLink} to={crumb.path || '#'} underline="hover" color="inherit" sx={{ fontSize: '0.85rem' }}>
                {crumb.label}
              </Link>
            )
          )}
        </Breadcrumbs>
      )}
    </Box>
  );
}
