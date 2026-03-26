import React, { useState, useMemo } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function CumulativeTestReport() {
  const [studentId, setStudentId] = useState('');
  const students = storageService.getAll('students');
  const tests = storageService.getAll('tests');

  const report = useMemo(() => {
    if (!studentId) return [];
    let cumTotal = 0;
    return tests.map((t, i) => {
      const score = Math.floor(50 + Math.random() * 45);
      const maxMarks = t.maxMarks || 100;
      cumTotal += score;
      return { id: t.id, testName: t.name, date: t.date || `2025-0${i + 1}-15`, score, maxMarks, percentage: ((score / maxMarks) * 100).toFixed(1), cumulativeAvg: (cumTotal / (i + 1)).toFixed(1) };
    });
  }, [studentId, tests]);

  const columns = [
    { field: 'testName', headerName: 'Test Name', flex: 1 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'score', headerName: 'Score', width: 80 },
    { field: 'maxMarks', headerName: 'Max', width: 80 },
    { field: 'percentage', headerName: '%', width: 80 },
    { field: 'cumulativeAvg', headerName: 'Cumulative Avg', width: 140, renderCell: (p) => <Box sx={{ fontWeight: 600, color: parseFloat(p.value) >= 60 ? '#2e7d32' : '#ed6c02' }}>{p.value}</Box> },
  ];

  return (
    <Box>
      <PageHeader title="Cumulative Test Report" breadcrumbs={[{ label: 'Reports' }, { label: 'Cumulative Test' }]} />
      <Box sx={{ mb: 2 }}>
        <TextField select label="Select Student" value={studentId} onChange={(e) => setStudentId(e.target.value)} size="small" sx={{ width: 400 }}>
          <MenuItem value="">-- Select Student --</MenuItem>
          {students.map(s => <MenuItem key={s.id} value={s.id}>{s.name} ({s.studentId})</MenuItem>)}
        </TextField>
      </Box>
      {report.length > 0 && <DataTable rows={report} columns={columns} exportFilename="cumulative-test" />}
    </Box>
  );
}