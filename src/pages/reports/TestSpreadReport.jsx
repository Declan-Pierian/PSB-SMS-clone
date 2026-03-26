import React, { useState, useMemo } from 'react';
import { Box, Paper, TextField, MenuItem, Typography } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function TestSpreadReport() {
  const [testId, setTestId] = useState('');
  const tests = storageService.getAll('tests');

  const distribution = useMemo(() => {
    if (!testId) return [];
    const ranges = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'];
    return ranges.map((range, i) => ({
      id: i, range, count: Math.floor(Math.random() * 15) + 1,
    }));
  }, [testId]);

  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  const columns = [
    { field: 'range', headerName: 'Score Range', width: 130 },
    { field: 'count', headerName: 'Students', width: 100 },
    {
      field: 'bar', headerName: 'Distribution', flex: 1,
      renderCell: (p) => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ height: 20, backgroundColor: '#b30537', borderRadius: 1, width: `${(p.row.count / maxCount) * 100}%`, minWidth: 4, transition: 'width 0.3s' }} />
          <Typography variant="caption">{p.row.count}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Test Spread Report" breadcrumbs={[{ label: 'Reports' }, { label: 'Test Spread' }]} />
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField select label="Select Test" value={testId} onChange={(e) => setTestId(e.target.value)} size="small" sx={{ width: 400 }}>
          <MenuItem value="">-- Select Test --</MenuItem>
          {tests.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
        </TextField>
      </Paper>
      {distribution.length > 0 && <DataTable rows={distribution} columns={columns} exportFilename="test-spread" />}
    </Box>
  );
}