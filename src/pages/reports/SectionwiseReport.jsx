import React, { useState, useMemo } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function SectionwiseReport() {
  const [program, setProgram] = useState('');
  const programs = storageService.getAll('programs');
  const cohorts = storageService.getAll('cohorts');

  const report = useMemo(() => {
    const filtered = cohorts.filter(c => !program || c.program === program);
    return filtered.map(c => ({
      id: c.id, section: c.code, program: c.program || 'N/A',
      totalStudents: c.maxStudents || Math.floor(Math.random() * 30) + 10,
      avgScore: (60 + Math.random() * 30).toFixed(1),
      passRate: (70 + Math.random() * 25).toFixed(1),
      highest: Math.floor(90 + Math.random() * 10),
      lowest: Math.floor(30 + Math.random() * 20),
    }));
  }, [cohorts, program]);

  const columns = [
    { field: 'section', headerName: 'Section/Cohort', flex: 1 },
    { field: 'program', headerName: 'Program', width: 200 },
    { field: 'totalStudents', headerName: 'Students', width: 100 },
    { field: 'avgScore', headerName: 'Avg Score', width: 110 },
    { field: 'passRate', headerName: 'Pass Rate %', width: 120, renderCell: (p) => <Box sx={{ fontWeight: 600, color: parseFloat(p.value) >= 70 ? '#2e7d32' : '#ed6c02' }}>{p.value}%</Box> },
    { field: 'highest', headerName: 'Highest', width: 90 },
    { field: 'lowest', headerName: 'Lowest', width: 90 },
  ];

  return (
    <Box>
      <PageHeader title="Sectionwise Report" breadcrumbs={[{ label: 'Reports' }, { label: 'Sectionwise' }]} />
      <Box sx={{ mb: 2 }}>
        <TextField select label="Program" value={program} onChange={(e) => setProgram(e.target.value)} size="small" sx={{ width: 300 }}>
          <MenuItem value="">All Programs</MenuItem>
          {programs.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
        </TextField>
      </Box>
      <DataTable rows={report} columns={columns} exportFilename="sectionwise-report" />
    </Box>
  );
}