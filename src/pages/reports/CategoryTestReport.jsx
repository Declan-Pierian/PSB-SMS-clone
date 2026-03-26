import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';
import { TEST_CATEGORIES } from '../../data/constants';

export default function CategoryTestReport() {
  const [program, setProgram] = useState('');
  const programs = storageService.getAll('programs');

  const report = TEST_CATEGORIES.map((cat, i) => ({
    id: i, category: cat,
    testCount: Math.floor(Math.random() * 10) + 2,
    avgScore: (55 + Math.random() * 35).toFixed(1),
    passRate: (65 + Math.random() * 30).toFixed(1),
  }));

  const columns = [
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'testCount', headerName: 'Tests', width: 100 },
    { field: 'avgScore', headerName: 'Avg Score', width: 120 },
    { field: 'passRate', headerName: 'Pass Rate %', width: 130, renderCell: (p) => <Box sx={{ fontWeight: 600, color: parseFloat(p.value) >= 70 ? '#2e7d32' : parseFloat(p.value) >= 50 ? '#ed6c02' : '#d32f2f' }}>{p.value}%</Box> },
  ];

  return (
    <Box>
      <PageHeader title="Category-wise Test Report" breadcrumbs={[{ label: 'Reports' }, { label: 'Category Test' }]} />
      <Box sx={{ mb: 2 }}>
        <TextField select label="Program" value={program} onChange={(e) => setProgram(e.target.value)} size="small" sx={{ width: 300 }}>
          <MenuItem value="">All Programs</MenuItem>
          {programs.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
        </TextField>
      </Box>
      <DataTable rows={report} columns={columns} exportFilename="category-test-report" />
    </Box>
  );
}