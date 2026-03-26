import React from 'react';
import { Chip } from '@mui/material';

const statusColors = {
  Active: { bg: '#e8f5e9', color: '#2e7d32' },
  Inactive: { bg: '#fafafa', color: '#757575' },
  Graduated: { bg: '#e3f2fd', color: '#1565c0' },
  Withdrawn: { bg: '#fff3e0', color: '#e65100' },
  Suspended: { bg: '#fce4ec', color: '#c62828' },
  Deferred: { bg: '#fff8e1', color: '#f9a825' },
  Paid: { bg: '#e8f5e9', color: '#2e7d32' },
  'Partially Paid': { bg: '#fff8e1', color: '#f9a825' },
  Overdue: { bg: '#fce4ec', color: '#c62828' },
  Generated: { bg: '#e3f2fd', color: '#1565c0' },
  Sent: { bg: '#e8f5e9', color: '#2e7d32' },
  Cancelled: { bg: '#fafafa', color: '#757575' },
  Pending: { bg: '#fff8e1', color: '#f9a825' },
  'Pending Approval': { bg: '#fff8e1', color: '#f9a825' },
  Approved: { bg: '#e8f5e9', color: '#2e7d32' },
  Rejected: { bg: '#fce4ec', color: '#c62828' },
  Processed: { bg: '#e3f2fd', color: '#1565c0' },
  Open: { bg: '#e3f2fd', color: '#1565c0' },
  'In Progress': { bg: '#fff8e1', color: '#f9a825' },
  Resolved: { bg: '#e8f5e9', color: '#2e7d32' },
  Closed: { bg: '#fafafa', color: '#757575' },
  Draft: { bg: '#f3e5f5', color: '#7b1fa2' },
  Published: { bg: '#e8f5e9', color: '#2e7d32' },
  Archived: { bg: '#fafafa', color: '#757575' },
  Completed: { bg: '#e8f5e9', color: '#2e7d32' },
  Upcoming: { bg: '#e3f2fd', color: '#1565c0' },
  Expired: { bg: '#fff3e0', color: '#e65100' },
  Terminated: { bg: '#fce4ec', color: '#c62828' },
  'On Leave': { bg: '#fff8e1', color: '#f9a825' },
  'Business Approved': { bg: '#e8f5e9', color: '#2e7d32' },
  'Finance Approved': { bg: '#e8f5e9', color: '#2e7d32' },
  Verified: { bg: '#e8f5e9', color: '#2e7d32' },
  Received: { bg: '#e3f2fd', color: '#1565c0' },
  Failed: { bg: '#fce4ec', color: '#c62828' },
  Delivered: { bg: '#e8f5e9', color: '#2e7d32' },
};

export default function StatusChip({ status, size = 'small' }) {
  const colors = statusColors[status] || { bg: '#f5f5f5', color: '#666' };
  return (
    <Chip
      label={status}
      size={size}
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: '0.75rem',
        borderRadius: '6px',
        height: size === 'small' ? 24 : 32,
      }}
    />
  );
}
