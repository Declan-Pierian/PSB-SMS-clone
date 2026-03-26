import React, { useState } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function MABUpdatesReport() {
  const [program, setProgram] = useState('');
  const programs = storageService.getAll('programs');
  const modules = storageService.getAll('modules');

  const report = modules.filter(m => !program || m.course === program).map((m, i) => ({
    id: m.id,
    module: m.name,
    decision: ['Grade Confirmed', 'Grade Adjusted', 'Re-assessment Approved', 'Deferred'][i % 4],
    updatedGrades: Math.floor(Math.random() * 5),
    remarks: ['No changes required', 'Borderline cases reviewed', 'Appeals considered', 'Board approved adjustments'][i % 4],
    boardDate: '2025-03-15',
  }));

  const columns = [
    { field: 'module', headerName: 'Module', flex: 1 },
    { field: 'decision', headerName: 'Decision', width: 180 },
    { field: 'updatedGrades', headerName: 'Updated Grades', width: 140 },
    { field: 'remarks', headerName: 'Remarks', flex: 1 },
    { field: 'boardDate', headerName: 'Board Date', width: 120 },
  ];

  return (
    <Box>
      <PageHeader title="MAB Updates Report" breadcrumbs={[{ label: 'Reports' }, { label: 'MAB Updates' }]} />
      <Box sx={{ mb: 2 }}>
        <TextField select label="Program" value={program} onChange={(e) => setProgram(e.target.value)} size="small" sx={{ width: 300 }}>
          <MenuItem value="">All Programs</MenuItem>
          {programs.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
        </TextField>
      </Box>
      <DataTable rows={report} columns={columns} exportFilename="mab-updates" />
    </Box>
  );
}