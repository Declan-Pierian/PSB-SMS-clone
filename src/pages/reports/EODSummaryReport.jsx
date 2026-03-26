import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'EOD Summary' }];

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}><CardContent sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color: color || '#b30537', mt: 1 }}>{value}</Typography>
  </CardContent></Card>
);

export default function EODSummaryReport() {
  const data = useMemo(() => storageService.getAll('timetable'), []);
  const columns = [{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }];

  return (
    <Box>
      <PageHeader title="EOD Summary Report" breadcrumbs={breadcrumbs} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Total Classes" value={data.length} color="#2B4D83" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Attendance Rate" value={"92%"} color="green" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Payments Today" value={"$12,500"} color="#b30537" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="New Enquiries" value={3} color="orange" /></Grid>
      </Grid>
      <Paper sx={{ p: 0 }}>
        <DataTable rows={data} columns={columns} exportFilename="timetable" />
      </Paper>
    </Box>
  );
}
