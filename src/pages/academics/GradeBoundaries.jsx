import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import { GRADE_BOUNDARIES } from '../../data/constants';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function GradeBoundaries() {
  const [boundaries, setBoundaries] = useState(GRADE_BOUNDARIES.map((b, i) => ({ ...b, id: i })));
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const startEdit = (row) => { setEditingId(row.id); setEditValue(String(row.minScore)); };
  const saveEdit = () => {
    setBoundaries(prev => prev.map(b => b.id === editingId ? { ...b, minScore: parseInt(editValue) || 0 } : b));
    setEditingId(null);
    enqueueSnackbar('Grade boundary updated', { variant: 'success' });
  };

  const gradeColors = { Distinction: '#2e7d32', Merit: '#1565c0', Pass: '#ed6c02', Fail: '#d32f2f' };

  return (
    <Box>
      <PageHeader title="Graduation Boundaries Pre Set" breadcrumbs={[{ label: 'Academics' }, { label: 'Grade Boundaries' }]} />
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Grade Boundary Configuration</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 700 }}>Grade</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Min Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Range</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boundaries.map((b, i) => {
                const maxScore = i === 0 ? 100 : boundaries[i - 1].minScore - 1;
                return (
                  <TableRow key={b.id} hover>
                    <TableCell><Typography sx={{ fontWeight: 600, color: gradeColors[b.grade] || '#333' }}>{b.grade}</Typography></TableCell>
                    <TableCell>
                      {editingId === b.id ? (
                        <TextField value={editValue} onChange={(e) => setEditValue(e.target.value)} size="small" type="number" sx={{ width: 80 }} />
                      ) : b.minScore}
                    </TableCell>
                    <TableCell>{b.minScore} - {maxScore}</TableCell>
                    <TableCell align="right">
                      {editingId === b.id ? (
                        <IconButton size="small" onClick={saveEdit}><SaveIcon fontSize="small" /></IconButton>
                      ) : (
                        <IconButton size="small" onClick={() => startEdit(b)}><EditIcon fontSize="small" /></IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}