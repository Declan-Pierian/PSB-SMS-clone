import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Button, TextField, MenuItem, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import SyncIcon from '@mui/icons-material/Sync';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const STORAGE_KEY = 'biometricSync';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Attendance' }, { label: 'Biometric - Sync Attendance' }];

export default function BiometricSyncAttendance() {
  const { enqueueSnackbar } = useSnackbar();
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [syncType, setSyncType] = useState('');
  const [syncStatus, setSyncStatus] = useState(null);

  const data = useMemo(() => storageService.getAll(STORAGE_KEY), [syncStatus]);

  const handleSync = () => {
    const totalRecords = Math.floor(Math.random() * 200) + 50;
    const failedRecords = Math.floor(Math.random() * 5);
    const syncedRecords = totalRecords - failedRecords;
    const newRecord = {
      syncId: `SYNC-${Date.now()}`,
      syncDate: new Date().toISOString().split('T')[0],
      syncType,
      totalRecords,
      syncedRecords,
      failedRecords,
      status: failedRecords === 0 ? 'Completed' : 'Partial',
      syncedBy: 'Admin'
    };
    storageService.create(STORAGE_KEY, newRecord);
    setSyncStatus({ variant: 'success', message: `Successfully synced ${syncedRecords} of ${totalRecords} ${syncType.toLowerCase()} attendance records from ${fromDate} to ${toDate}.` });
    enqueueSnackbar('Sync completed successfully', { variant: 'success' });
  };

  const columns = [
    { field: 'syncId', headerName: 'Sync ID', flex: 0.8, minWidth: 120 },
    { field: 'syncDate', headerName: 'Sync Date', flex: 0.7, minWidth: 100 },
    { field: 'syncType', headerName: 'Sync Type', flex: 0.7, minWidth: 100 },
    { field: 'totalRecords', headerName: 'Total Records', flex: 0.7, minWidth: 100 },
    { field: 'syncedRecords', headerName: 'Synced', flex: 0.6, minWidth: 80 },
    { field: 'failedRecords', headerName: 'Failed', flex: 0.5, minWidth: 70 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'syncedBy', headerName: 'Synced By', flex: 0.7, minWidth: 100 }
  ];

  return (
    <Box>
      <PageHeader title="Biometric - Sync Attendance" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Sync Configuration</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth type="date" label="From Date" value={fromDate} onChange={e => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth type="date" label="To Date" value={toDate} onChange={e => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth select label="Sync Type" value={syncType} onChange={e => setSyncType(e.target.value)} size="small">
              <MenuItem value="Students">Students</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Button variant="contained" startIcon={<SyncIcon />} onClick={handleSync} disabled={!syncType} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Sync</Button>
          </Grid>
        </Grid>
        {syncStatus && <Alert severity={syncStatus.variant} sx={{ mt: 2 }}>{syncStatus.message}</Alert>}
      </Paper>
      <DataTable rows={data} columns={columns} exportFilename="biometricSyncHistory" />
    </Box>
  );
}
