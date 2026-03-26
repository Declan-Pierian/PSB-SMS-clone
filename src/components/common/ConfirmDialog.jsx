import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({ open, title = 'Confirm', message = 'Are you sure?', onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel', severity = 'error' }) {
  const colors = {
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#0288d1',
    success: '#2e7d32',
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">{cancelLabel}</Button>
        <Button onClick={onConfirm} variant="contained" sx={{ backgroundColor: colors[severity], '&:hover': { backgroundColor: colors[severity], filter: 'brightness(0.9)' } }}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
