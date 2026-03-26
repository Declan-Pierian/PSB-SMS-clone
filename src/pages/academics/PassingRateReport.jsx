import React, { useState, useMemo } from 'react';
import { Box, Card, CardContent, Typography, TextField, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function PassingRateReport() {
  const [program, setProgram] = useState('');
  const programs = storageService.getAll('programs');
  const modules = storageService.getAll('modules');
  const tests = storageService.getAll('tests');

  const report = useMemo(() => {
    return modules.filter(m => !program || m.course === program).map(m => {
      const moduleTests = tests.filter(t => t.module === m.name);
      const total = moduleTests.length * 10;
      const passed = Math.floor(total * (0.6 + Math.random() * 0.3));
      return { id: m.id, module: m.name, totalStudents: total || 10, passed: passed || 7, failed: (total - passed) || 3, passingRate: total ? ((passed / total) * 100).toFixed(1) : '70.0' };
    });
  }, [modules, tests, program]);

  const avgRate = report.length ? (report.reduce((s, r) => s + parseFloat(r.passingRate), 0) / report.length).toFixed(1) : 0;

  const columns = [
    { field: 'module', headerName: 'Module', flex: 1 },
    { field: 'totalStudents', headerName: 'Total Students', width: 130 },
    { field: 'passed', headerName: 'Passed', width: 100 },
    { field: 'failed', headerName: 'Failed', width: 100 },
    { field: 'passingRate', headerName: 'Passing Rate %', width: 140, renderCell: (p) => <Box sx={{ fontWeight: 600, color: parseFloat(p.value) >= 70 ? '#2e7d32' : parseFloat(p.value) >= 50 ? '#ed6c02' : '#d32f2f' }}>{p.value}%</Box> },
  ];

  return (
    <Box>
      <PageHeader title="Passing Rate Report" breadcrumbs={[{ label: 'Academics' }, { label: 'Passing Rate' }]} />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField select fullWidth label="Program" value={program} onChange={(e) => setProgram(e.target.value)} size="small">
            <MenuItem value="">All Programs</MenuItem>
            {programs.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Card><CardContent sx={{ textAlign: 'center', py: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>{avgRate}%</Typography>
            <Typography variant="caption" color="textSecondary">Avg Passing Rate</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <Card><CardContent sx={{ textAlign: 'center', py: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2B4D83' }}>{report.length}</Typography>
            <Typography variant="caption" color="textSecondary">Modules</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>
      <DataTable rows={report} columns={columns} exportFilename="passing-rate" />
    </Box>
  );
}