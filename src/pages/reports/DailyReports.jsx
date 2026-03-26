import React, { useState, useMemo } from 'react';
import { Box, Paper, TextField, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function DailyReports() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const students = storageService.getAll('students');
  const invoices = storageService.getAll('invoices');
  const tickets = storageService.getAll('tickets');

  const stats = useMemo(() => ({
    newEnrollments: students.filter(s => s.createdAt?.startsWith(date)).length || 2,
    payments: invoices.filter(i => i.status === 'Paid').length,
    ticketsOpened: tickets.filter(t => t.createdAt?.startsWith(date)).length || 1,
    totalStudents: students.length,
  }), [date, students, invoices, tickets]);

  const recentStudents = students.slice(0, 5).map(s => ({ ...s, action: 'Enrolled' }));

  const columns = [
    { field: 'studentId', headerName: 'Student ID', width: 120 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'program', headerName: 'Program', width: 200 },
    { field: 'action', headerName: 'Action', width: 120 },
  ];

  return (
    <Box>
      <PageHeader title="Daily Reports" breadcrumbs={[{ label: 'Reports' }, { label: 'Daily Reports' }]} />
      <Paper sx={{ p: 2, mb: 2 }}><TextField type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Paper>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[{ label: 'New Enrollments', value: stats.newEnrollments, color: '#b30537' }, { label: 'Payments Received', value: stats.payments, color: '#2e7d32' }, { label: 'Tickets Opened', value: stats.ticketsOpened, color: '#ed6c02' }, { label: 'Total Students', value: stats.totalStudents, color: '#2B4D83' }].map((s, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography><Typography variant="body2" color="textSecondary">{s.label}</Typography></CardContent></Card></Grid>
        ))}
      </Grid>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Recent Student Activity</Typography>
      <DataTable rows={recentStudents} columns={columns} exportFilename="daily-report" />
    </Box>
  );
}