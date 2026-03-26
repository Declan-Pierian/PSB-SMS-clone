import React, { useMemo } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function TestDataEntryMonitoring() {
  const tests = storageService.getAll('tests');

  const report = useMemo(() => {
    return tests.map(t => {
      const total = Math.floor(Math.random() * 40) + 10;
      const entered = Math.floor(total * (0.3 + Math.random() * 0.7));
      return { ...t, totalStudents: total, marksEntered: entered, marksRemaining: total - entered, progress: ((entered / total) * 100).toFixed(0), enteredBy: 'Lecturer', lastUpdated: '2025-03-20' };
    });
  }, [tests]);

  const columns = [
    { field: 'name', headerName: 'Test Name', flex: 1 },
    { field: 'module', headerName: 'Module', width: 150 },
    { field: 'totalStudents', headerName: 'Total', width: 80 },
    { field: 'marksEntered', headerName: 'Entered', width: 90 },
    { field: 'marksRemaining', headerName: 'Remaining', width: 100 },
    {
      field: 'progress', headerName: 'Progress', width: 180,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <LinearProgress variant="determinate" value={parseFloat(p.value)} sx={{ flex: 1, height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { backgroundColor: parseFloat(p.value) === 100 ? '#2e7d32' : '#b30537' } }} />
          <Typography variant="caption" sx={{ minWidth: 35 }}>{p.value}%</Typography>
        </Box>
      ),
    },
    { field: 'enteredBy', headerName: 'Entered By', width: 120 },
    { field: 'lastUpdated', headerName: 'Last Updated', width: 120 },
  ];

  return (
    <Box>
      <PageHeader title="Test Data Entry Monitoring" breadcrumbs={[{ label: 'Reports' }, { label: 'Test Monitoring' }]} />
      <DataTable rows={report} columns={columns} exportFilename="test-monitoring" />
    </Box>
  );
}