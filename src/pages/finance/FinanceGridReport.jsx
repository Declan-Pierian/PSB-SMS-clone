import React, { useState, useMemo } from 'react';
import { Box, Paper, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import storageService from '../../services/storageService';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function FinanceGridReport() {
  const [program, setProgram] = useState('');
  const programs = storageService.getAll('programs');
  const students = storageService.getAll('students');
  const invoices = storageService.getAll('invoices');

  const filteredStudents = useMemo(() => {
    if (!program) return students;
    return students.filter(s => s.program === program);
  }, [students, program]);

  const getPaymentForMonth = (studentName, monthIndex) => {
    return invoices
      .filter(i => i.studentName === studentName && i.status === 'Paid')
      .filter(i => { const d = new Date(i.dueDate || i.createdAt); return d.getMonth() === monthIndex; })
      .reduce((s, i) => s + (i.amount || 0), 0);
  };

  const monthTotals = MONTHS.map((_, i) => invoices.filter(inv => { const d = new Date(inv.dueDate || inv.createdAt); return d.getMonth() === i && inv.status === 'Paid'; }).reduce((s, inv) => s + (inv.amount || 0), 0));

  return (
    <Box>
      <PageHeader title="Finance Grid Report" breadcrumbs={[{ label: 'Finance' }, { label: 'Grid Report' }]} />
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField select label="Program" value={program} onChange={(e) => setProgram(e.target.value)} size="small" sx={{ width: 300 }}>
          <MenuItem value="">All Programs</MenuItem>
          {programs.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
        </TextField>
      </Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              {MONTHS.map(m => <TableCell key={m} align="right" sx={{ fontWeight: 700 }}>{m}</TableCell>)}
              <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.slice(0, 20).map(s => {
              const rowTotal = MONTHS.reduce((sum, _, i) => sum + getPaymentForMonth(s.name, i), 0);
              return (
                <TableRow key={s.id} hover>
                  <TableCell>{s.name}</TableCell>
                  {MONTHS.map((_, i) => { const v = getPaymentForMonth(s.name, i); return <TableCell key={i} align="right">{v ? `$${v.toLocaleString()}` : '-'}</TableCell>; })}
                  <TableCell align="right" sx={{ fontWeight: 600 }}>${rowTotal.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
              {monthTotals.map((t, i) => <TableCell key={i} align="right" sx={{ fontWeight: 700 }}>{t ? `$${t.toLocaleString()}` : '-'}</TableCell>)}
              <TableCell align="right" sx={{ fontWeight: 700 }}>${monthTotals.reduce((s, t) => s + t, 0).toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}