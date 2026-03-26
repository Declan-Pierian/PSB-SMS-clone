import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import LockResetIcon from '@mui/icons-material/LockReset';

export default function ChangePassword() {
  const [values, setValues] = useState({ current: '', newPwd: '', confirm: '' });
  const [error, setError] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (values.newPwd.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (values.newPwd !== values.confirm) { setError('Passwords do not match'); return; }
    if (values.current === values.newPwd) { setError('New password must be different'); return; }
    enqueueSnackbar('Password changed successfully', { variant: 'success' });
    setValues({ current: '', newPwd: '', confirm: '' });
  };

  return (
    <Box>
      <PageHeader title="Change Password" breadcrumbs={[{ label: 'Profile' }, { label: 'Change Password' }]} />
      <Paper sx={{ p: 4, maxWidth: 500 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Update Your Password</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Current Password" type="password" value={values.current} onChange={(e) => setValues({ ...values, current: e.target.value })} sx={{ mb: 2.5 }} required size="small" />
          <TextField fullWidth label="New Password" type="password" value={values.newPwd} onChange={(e) => setValues({ ...values, newPwd: e.target.value })} sx={{ mb: 2.5 }} required size="small" helperText="Minimum 8 characters" />
          <TextField fullWidth label="Confirm New Password" type="password" value={values.confirm} onChange={(e) => setValues({ ...values, confirm: e.target.value })} sx={{ mb: 3 }} required size="small" />
          <Button type="submit" variant="contained" startIcon={<LockResetIcon />} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>
            Change Password
          </Button>
        </form>
      </Paper>
    </Box>
  );
}