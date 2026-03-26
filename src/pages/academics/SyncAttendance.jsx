import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, MenuItem, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import SyncIcon from '@mui/icons-material/Sync';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Sync Attendance' }];

export default function SyncAttendance() {
  const { enqueueSnackbar } = useSnackbar();
  const [source, setSource] = useState('');
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    setSynced(true);
    enqueueSnackbar('Attendance synced successfully', { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader title="Sync Attendance" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Sync from External System</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth select label="Source" value={source} onChange={e => setSource(e.target.value)} size="small"><MenuItem value="Biometric">Biometric</MenuItem><MenuItem value="LMS">LMS</MenuItem><MenuItem value="Manual">Manual Upload</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="date" label="Date" defaultValue={new Date().toISOString().split('T')[0]} InputLabelProps={{ shrink: true }} size="small" /></Grid>
          <Grid size={{ xs: 12, sm: 2 }}><Button variant="contained" startIcon={<SyncIcon />} onClick={handleSync} disabled={!source} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Sync</Button></Grid>
        </Grid>
        {synced && <Alert severity="success" sx={{ mt: 2 }}>Successfully synced 150 attendance records from {source}.</Alert>}
      </Paper>
    </Box>
  );
}
