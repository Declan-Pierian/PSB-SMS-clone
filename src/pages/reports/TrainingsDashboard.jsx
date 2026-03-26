import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Trainings Dashboard' }];

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}><CardContent sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color: color || '#b30537', mt: 1 }}>{value}</Typography>
  </CardContent></Card>
);

export default function TrainingsDashboard() {
  const data = useMemo(() => storageService.getAll('programs'), []);
  const columns = [{ field: 'name', headerName: 'Training', flex: 1.5, minWidth: 200 }, { field: 'type', headerName: 'Category', flex: 0.8, minWidth: 100 }, { field: 'duration', headerName: 'Duration', flex: 0.6, minWidth: 90 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Trainings Dashboard" breadcrumbs={breadcrumbs} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Active Trainings" value={5} color="#2B4D83" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Enrolled" value={120} color="green" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Completed" value={45} color="#b30537" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Upcoming" value={3} color="orange" /></Grid>
      </Grid>
      <Paper sx={{ p: 0 }}>
        <DataTable rows={data} columns={columns} exportFilename="programs" />
      </Paper>
    </Box>
  );
}
