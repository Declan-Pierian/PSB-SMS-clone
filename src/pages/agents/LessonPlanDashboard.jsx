import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'LessonPlan Dashboard' }];

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}><CardContent sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color: color || '#b30537', mt: 1 }}>{value}</Typography>
  </CardContent></Card>
);

export default function LessonPlanDashboard() {
  const data = useMemo(() => storageService.getAll('lessonPlans'), []);
  const columns = [{ field: 'module', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="LessonPlan Dashboard" breadcrumbs={breadcrumbs} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Total Plans" value={data.length || 0} color="#2B4D83" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Active" value={8} color="green" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Pending Review" value={3} color="orange" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Coverage" value={"85%"} color="#b30537" /></Grid>
      </Grid>
      <Paper sx={{ p: 0 }}>
        <DataTable rows={data} columns={columns} exportFilename="lessonPlans" />
      </Paper>
    </Box>
  );
}
