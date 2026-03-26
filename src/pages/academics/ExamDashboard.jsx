import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Exam Dashboard' }];

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}><CardContent sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color: color || '#b30537', mt: 1 }}>{value}</Typography>
  </CardContent></Card>
);

export default function ExamDashboard() {
  const data = useMemo(() => storageService.getAll('tests'), []);
  const columns = [{ field: 'name', headerName: 'Test', flex: 1.2, minWidth: 160 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Exam Dashboard" breadcrumbs={breadcrumbs} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Upcoming Exams" value={data.filter(t => t.status === "Draft").length} color="#2B4D83" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="In Progress" value={data.filter(t => t.status === "Published").length} color="orange" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Completed" value={data.filter(t => t.status === "Frozen" || t.status === "Completed").length} color="green" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Total Tests" value={data.length} color="#b30537" /></Grid>
      </Grid>
      <Paper sx={{ p: 0 }}>
        <DataTable rows={data} columns={columns} exportFilename="tests" />
      </Paper>
    </Box>
  );
}
