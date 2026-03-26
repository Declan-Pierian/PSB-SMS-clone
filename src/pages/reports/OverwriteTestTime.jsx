import React, { useState } from 'react';
import { Box, Paper, TextField, MenuItem, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import storageService from '../../services/storageService';

export default function OverwriteTestTime() {
  const [testId, setTestId] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [reason, setReason] = useState('');
  const [history, setHistory] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const tests = storageService.getAll('tests');
  const test = tests.find(t => t.id === testId);

  const handleOverwrite = () => {
    if (!reason) { enqueueSnackbar('Reason is required', { variant: 'error' }); return; }
    setHistory(prev => [{ test: test?.name, oldStart: test?.startTime || '09:00', oldEnd: test?.endTime || '12:00', newStart, newEnd, reason, date: new Date().toLocaleString(), user: 'Admin' }, ...prev]);
    enqueueSnackbar('Test time overwritten', { variant: 'success' });
    setReason(''); setNewStart(''); setNewEnd('');
  };

  return (
    <Box>
      <PageHeader title="Overwrite Test Time" breadcrumbs={[{ label: 'Reports' }, { label: 'Overwrite Test Time' }]} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField select label="Select Test" value={testId} onChange={(e) => setTestId(e.target.value)} size="small" sx={{ width: 400, mb: 2 }} fullWidth>
          <MenuItem value="">-- Select Test --</MenuItem>
          {tests.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
        </TextField>
        {test && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <TextField label="New Start Time" type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} InputLabelProps={{ shrink: true }} size="small" sx={{ width: 160 }} />
            <TextField label="New End Time" type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} InputLabelProps={{ shrink: true }} size="small" sx={{ width: 160 }} />
            <TextField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} size="small" sx={{ flex: 1, minWidth: 200 }} required />
            <Button variant="contained" onClick={handleOverwrite} sx={{ backgroundColor: '#b30537' }}>Overwrite</Button>
          </Box>
        )}
      </Paper>
      {history.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Overwrite History</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow sx={{ backgroundColor: '#f8f9fa' }}><TableCell sx={{ fontWeight: 700 }}>Test</TableCell><TableCell sx={{ fontWeight: 700 }}>New Start</TableCell><TableCell sx={{ fontWeight: 700 }}>New End</TableCell><TableCell sx={{ fontWeight: 700 }}>Reason</TableCell><TableCell sx={{ fontWeight: 700 }}>By</TableCell><TableCell sx={{ fontWeight: 700 }}>Date</TableCell></TableRow></TableHead>
              <TableBody>{history.map((h, i) => <TableRow key={i}><TableCell>{h.test}</TableCell><TableCell>{h.newStart}</TableCell><TableCell>{h.newEnd}</TableCell><TableCell>{h.reason}</TableCell><TableCell>{h.user}</TableCell><TableCell>{h.date}</TableCell></TableRow>)}</TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}