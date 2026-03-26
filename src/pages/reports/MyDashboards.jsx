import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function MyDashboards() {
  const [dashboards, setDashboards] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setDashboards(storageService.getAll('dashboards')); }, []);
  const refresh = () => setDashboards(storageService.getAll('dashboards'));

  const formFields = [
    { name: 'name', label: 'Dashboard Name', required: true },
    { name: 'description', label: 'Description' },
    { name: 'widgets', label: 'Widgets (comma-separated)', fullWidth: true, defaultValue: 'Student Stats,Finance Summary,Academic Stats' },
  ];

  const stats = {
    'Student Stats': { value: storageService.getAll('students').length, label: 'Students', color: '#b30537' },
    'Finance Summary': { value: `$${storageService.getAll('invoices').reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}`, label: 'Revenue', color: '#2e7d32' },
    'Academic Stats': { value: storageService.getAll('tests').length, label: 'Tests', color: '#2B4D83' },
    'HR Overview': { value: storageService.getAll('employees').length, label: 'Employees', color: '#ed6c02' },
  };

  return (
    <Box>
      <PageHeader title="My Dashboards" breadcrumbs={[{ label: 'Reports' }, { label: 'My Dashboards' }]} actionLabel="Create Dashboard" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      {dashboards.map(d => (
        <Box key={d.id} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><DashboardIcon sx={{ color: '#b30537' }} /><Typography variant="h6" sx={{ fontWeight: 600 }}>{d.name}</Typography></Box>
            <IconButton size="small" color="error" onClick={() => setDeleteId(d.id)}><DeleteIcon /></IconButton>
          </Box>
          <Grid container spacing={2}>
            {(d.widgets || '').split(',').map((w, i) => {
              const stat = stats[w.trim()] || { value: '0', label: w.trim(), color: '#666' };
              return (
                <Grid size={{ xs: 6, md: 3 }} key={i}><Card><CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                  <Typography variant="body2" color="textSecondary">{stat.label}</Typography>
                </CardContent></Card></Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
      {dashboards.length === 0 && <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>No dashboards created yet.</Typography>}
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(v) => { storageService.create('dashboards', v); refresh(); setDialogOpen(false); enqueueSnackbar('Dashboard created', { variant: 'success' }); }} title="Create Dashboard" fields={formFields} />
      <ConfirmDialog open={!!deleteId} title="Delete Dashboard" message="Are you sure?" onConfirm={() => { storageService.remove('dashboards', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}