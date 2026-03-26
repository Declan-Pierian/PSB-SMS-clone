import React, { useState, useMemo } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const SummaryCard = ({ icon: Icon, label, value, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 48, height: 48, borderRadius: '12px',
          backgroundColor: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon sx={{ color, fontSize: 28 }} />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color }}>{value}</Typography>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">{subtitle}</Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default function CohortReports() {
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState({});

  const programs = storageService.getAll('programs');
  const cohorts = storageService.getAll('cohorts');
  const students = storageService.getAll('students');

  const programOptions = programs.map((p) => ({ label: p.name || p.programName, value: p.id }));
  const cohortOptions = cohorts.map((c) => ({ label: c.name || c.cohortName || c.code, value: c.id }));

  const searchFields = [
    { name: 'program', label: 'Program', type: 'select', options: programOptions, gridSize: 3 },
    { name: 'cohort', label: 'Cohort', type: 'select', options: cohortOptions, gridSize: 3 },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Graduated', 'Withdrawn', 'Deferred', 'Suspended'], gridSize: 3 },
  ];

  const filteredStudents = useMemo(() => {
    let data = students;
    if (filters.program) {
      data = data.filter((s) => s.programId === filters.program || s.program === filters.program);
    }
    if (filters.cohort) {
      data = data.filter((s) => s.cohortId === filters.cohort || s.cohort === filters.cohort);
    }
    if (filters.status) {
      data = data.filter((s) => s.status === filters.status);
    }
    return data;
  }, [students, filters]);

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const active = filteredStudents.filter((s) => s.status === 'Active').length;
    const graduated = filteredStudents.filter((s) => s.status === 'Graduated').length;
    const withdrawn = filteredStudents.filter((s) => s.status === 'Withdrawn').length;
    const gpas = filteredStudents.map((s) => parseFloat(s.gpa || s.cgpa || 0)).filter((g) => g > 0);
    const avgGpa = gpas.length > 0 ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2) : '0.00';
    const completionRate = total > 0 ? ((graduated / total) * 100).toFixed(1) : '0.0';
    const dropoutRate = total > 0 ? ((withdrawn / total) * 100).toFixed(1) : '0.0';

    return { total, active, graduated, withdrawn, avgGpa, completionRate, dropoutRate };
  }, [filteredStudents]);

  const handleSearch = (values) => {
    setFilters(values);
    enqueueSnackbar('Report generated successfully', { variant: 'success' });
  };

  const handleReset = () => {
    setFilters({});
  };

  const columns = [
    { field: 'studentId', headerName: 'Student ID', flex: 1, minWidth: 110 },
    { field: 'name', headerName: 'Student Name', flex: 1.5, minWidth: 160, valueGetter: (value, row) => row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim() },
    { field: 'program', headerName: 'Program', flex: 1.5, minWidth: 150, valueGetter: (value, row) => {
      if (row.programName) return row.programName;
      const prog = programs.find((p) => p.id === row.programId);
      return prog ? (prog.name || prog.programName) : row.program || '-';
    }},
    { field: 'cohort', headerName: 'Cohort', flex: 1, minWidth: 110, valueGetter: (value, row) => {
      if (row.cohortName) return row.cohortName;
      const coh = cohorts.find((c) => c.id === row.cohortId);
      return coh ? (coh.name || coh.cohortName || coh.code) : row.cohort || '-';
    }},
    { field: 'gpa', headerName: 'GPA', flex: 0.7, minWidth: 80, valueGetter: (value, row) => row.gpa || row.cgpa || '-' },
    { field: 'attendance', headerName: 'Attendance %', flex: 0.8, minWidth: 110, valueGetter: (value, row) => row.attendance ? `${row.attendance}%` : '-' },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 110, renderCell: (params) => <StatusChip status={params.value || 'Active'} /> },
  ];

  const summaryCards = [
    { icon: GroupIcon, label: 'Total Students', value: stats.total, color: '#b30537' },
    { icon: SchoolIcon, label: 'Completion Rate', value: `${stats.completionRate}%`, color: '#2e7d32', subtitle: `${stats.graduated} graduated` },
    { icon: TrendingUpIcon, label: 'Average GPA', value: stats.avgGpa, color: '#1565c0' },
    { icon: TrendingDownIcon, label: 'Dropout Rate', value: `${stats.dropoutRate}%`, color: '#e65100', subtitle: `${stats.withdrawn} withdrawn` },
  ];

  return (
    <Box>
      <PageHeader
        title="Cohort Reports"
        breadcrumbs={[
          { label: 'Reports', path: '/reports' },
          { label: 'Cohort Reports' },
        ]}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {summaryCards.map((card, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <SummaryCard {...card} />
          </Grid>
        ))}
      </Grid>

      <DataTable
        rows={filteredStudents}
        columns={columns}
        exportFilename="cohort-report"
        pageSize={10}
      />
    </Box>
  );
}
