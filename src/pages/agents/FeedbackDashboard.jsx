import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Dashboard' }];

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}><CardContent sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color: color || '#b30537', mt: 1 }}>{value}</Typography>
  </CardContent></Card>
);

export default function FeedbackDashboard() {
  const data = useMemo(() => storageService.getAll('feedbackForms'), []);
  const columns = [{ field: 'title', headerName: 'Form', flex: 1.2, minWidth: 150 }, { field: 'target', headerName: 'Target', flex: 0.7, minWidth: 90 }, { field: 'period', headerName: 'Period', flex: 0.7, minWidth: 90 }];

  return (
    <Box>
      <PageHeader title="Feedback Dashboard" breadcrumbs={breadcrumbs} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Active Forms" value={5} color="#2B4D83" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Total Responses" value={342} color="green" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Avg Rating" value={"4.2/5"} color="#b30537" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Pending Reviews" value={12} color="orange" /></Grid>
      </Grid>
      <Paper sx={{ p: 0 }}>
        <DataTable rows={data} columns={columns} exportFilename="feedbackForms" />
      </Paper>
    </Box>
  );
}
