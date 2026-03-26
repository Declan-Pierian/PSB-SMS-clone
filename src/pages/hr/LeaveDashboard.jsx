import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { LEAVE_TYPES } from '../../data/constants';
import AddIcon from '@mui/icons-material/Add';

export default function LeaveDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setLeaves(storageService.getAll('leaves')); }, []);
  const refresh = () => setLeaves(storageService.getAll('leaves'));

  const stats = [
    { label: 'Total Applied', value: leaves.length, color: '#2B4D83' },
    { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length, color: '#2e7d32' },
    { label: 'Pending', value: leaves.filter(l => l.status === 'Pending').length, color: '#ed6c02' },
    { label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length, color: '#d32f2f' },
  ];

  const columns = [
    { field: 'employeeName', headerName: 'Employee', flex: 1 },
    { field: 'leaveType', headerName: 'Leave Type', width: 150 },
    { field: 'fromDate', headerName: 'From', width: 110 },
    { field: 'toDate', headerName: 'To', width: 110 },
    { field: 'days', headerName: 'Days', width: 70 },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    {
      field: 'actions', headerName: 'Actions', width: 180, sortable: false,
      renderCell: (p) => p.row.status === 'Pending' ? (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" color="success" onClick={() => handleAction(p.row.id, 'Approved')}>Approve</Button>
          <Button size="small" color="error" onClick={() => handleAction(p.row.id, 'Rejected')}>Reject</Button>
        </Box>
      ) : null,
    },
  ];

  const handleAction = (id, status) => {
    storageService.update('leaves', id, { status });
    refresh();
    enqueueSnackbar(`Leave ${status.toLowerCase()}`, { variant: status === 'Approved' ? 'success' : 'warning' });
  };

  const handleSubmit = (values) => {
    const from = new Date(values.fromDate);
    const to = new Date(values.toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
    storageService.create('leaves', { ...values, days, status: 'Pending' });
    refresh();
    setDialogOpen(false);
    enqueueSnackbar('Leave application submitted', { variant: 'success' });
  };

  const fields = [
    { name: 'employeeName', label: 'Employee Name', required: true },
    { name: 'leaveType', label: 'Leave Type', type: 'select', options: LEAVE_TYPES, required: true },
    { name: 'fromDate', label: 'From Date', type: 'date', required: true },
    { name: 'toDate', label: 'To Date', type: 'date', required: true },
    { name: 'reason', label: 'Reason', type: 'textarea', fullWidth: true },
  ];

  return (
    <Box>
      <PageHeader title="Employees Leaves Dashboard" breadcrumbs={[{ label: 'Human Resources' }, { label: 'Leaves Dashboard' }]} actionLabel="Apply Leave" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" color="textSecondary">{s.label}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <DataTable rows={leaves} columns={columns} exportFilename="leaves" />
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleSubmit} title="Apply Leave" fields={fields} />
    </Box>
  );
}