import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, MenuItem, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import CachedIcon from '@mui/icons-material/Cached';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { v4 as uuidv4 } from 'uuid';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Invalidate Cache' }];

export default function InvalidateCache() {
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState('All');
  const [history, setHistory] = useState([]);

  const handleInvalidate = () => {
    setHistory(prev => [...prev, { id: uuidv4(), date: new Date().toISOString(), type, scope: 'All', triggeredBy: 'Admin', status: 'Completed' }]);
    enqueueSnackbar('Cache invalidated successfully', { variant: 'success' });
  };

  const columns = [
    { field: 'date', headerName: 'Date', flex: 1.2, minWidth: 160 },
    { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 100 },
    { field: 'scope', headerName: 'Scope', flex: 0.6, minWidth: 80 },
    { field: 'triggeredBy', headerName: 'By', flex: 0.7, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90 },
  ];

  return (
    <Box>
      <PageHeader title="Invalidate Resource Cache" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth select label="Resource Type" value={type} onChange={e => setType(e.target.value)} size="small"><MenuItem value="All">All</MenuItem><MenuItem value="Templates">Templates</MenuItem><MenuItem value="Reports">Reports</MenuItem><MenuItem value="Data">Data</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, sm: 3 }}><Button variant="contained" startIcon={<CachedIcon />} onClick={handleInvalidate} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Invalidate Cache</Button></Grid>
        </Grid>
      </Paper>
      {history.length > 0 && <DataTable rows={history} columns={columns} exportFilename="cache-history" />}
    </Box>
  );
}
