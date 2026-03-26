import React, { useState, useMemo } from 'react';
import { Box, Paper, TextField, MenuItem, Chip } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function DefaultersReport() {
  const [program, setProgram] = useState('');
  const [minDays, setMinDays] = useState(30);
  const programs = storageService.getAll('programs');
  const invoices = storageService.getAll('invoices');

  const defaulters = useMemo(() => {
    const now = new Date();
    return invoices
      .filter(i => i.status === 'Overdue' || (i.status !== 'Paid' && i.status !== 'Cancelled' && i.dueDate && new Date(i.dueDate) < now))
      .map(i => {
        const due = new Date(i.dueDate);
        const overdueDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
        return { ...i, overdueDays };
      })
      .filter(i => i.overdueDays >= minDays)
      .filter(i => !program || i.program === program);
  }, [invoices, program, minDays]);

  const columns = [
    { field: 'studentName', headerName: 'Student', flex: 1 },
    { field: 'program', headerName: 'Program', width: 180 },
    { field: 'invoiceNo', headerName: 'Invoice No', width: 130 },
    { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (v) => `$${(v || 0).toLocaleString()}` },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    {
      field: 'overdueDays', headerName: 'Overdue Days', width: 130,
      renderCell: (p) => <Chip label={`${p.value} days`} size="small" color={p.value > 90 ? 'error' : p.value > 60 ? 'warning' : 'default'} />,
    },
  ];

  return (
    <Box>
      <PageHeader title="Defaulters Report" breadcrumbs={[{ label: 'Finance' }, { label: 'Defaulters Report' }]} />
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
        <TextField select label="Program" value={program} onChange={(e) => setProgram(e.target.value)} size="small" sx={{ width: 250 }}>
          <MenuItem value="">All Programs</MenuItem>
          {programs.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
        </TextField>
        <TextField select label="Overdue Days" value={minDays} onChange={(e) => setMinDays(Number(e.target.value))} size="small" sx={{ width: 160 }}>
          {[30, 60, 90, 120].map(d => <MenuItem key={d} value={d}>{`> ${d} days`}</MenuItem>)}
        </TextField>
      </Paper>
      <DataTable rows={defaulters} columns={columns} exportFilename="defaulters-report" />
    </Box>
  );
}