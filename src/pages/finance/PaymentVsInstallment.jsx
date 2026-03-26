import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Finance', path: '/finance' }, { label: 'Student Payment Vs Installment' }];

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: color || '#b30537', mt: 1 }}>{value}</Typography>
    </CardContent>
  </Card>
);

export default function PaymentVsInstallment() {
  const students = useMemo(() => storageService.getAll('students'), []);
  const invoices = useMemo(() => storageService.getAll('invoices'), []);
  const programs = useMemo(() => storageService.getAll('programs'), []);
  const [filtered, setFiltered] = useState(null);

  const searchFields = [
    { name: 'program', label: 'Program', type: 'select', options: programs.map(p => ({ label: p.name, value: p.shortCode })), gridSize: 3 },
    { name: 'status', label: 'Status', type: 'select', options: ['On Track', 'Behind', 'Ahead'], gridSize: 2 },
  ];

  const reportData = useMemo(() => {
    return students.filter(s => s.status === 'Active').map(s => {
      const prog = programs.find(p => p.shortCode === s.program);
      const totalFee = prog ? prog.fees : 0;
      const studentInvoices = invoices.filter(i => i.studentCode === s.studentCode);
      const paid = studentInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);
      const balance = totalFee - paid;
      const paidPct = totalFee > 0 ? (paid / totalFee) * 100 : 0;
      return { id: s.id, studentCode: s.studentCode, name: s.name, program: s.program, totalFee, installmentPlan: `${Math.ceil(totalFee / 4)} x 4`, amountPaid: paid, balance, status: paidPct >= 100 ? 'Ahead' : paidPct >= 50 ? 'On Track' : 'Behind' };
    });
  }, [students, invoices, programs]);

  const displayData = filtered || reportData;
  const totalReceivable = displayData.reduce((s, r) => s + r.totalFee, 0);
  const totalCollected = displayData.reduce((s, r) => s + r.amountPaid, 0);

  const handleSearch = (filters) => {
    let result = reportData;
    if (filters.program) result = result.filter(r => r.program === filters.program);
    if (filters.status) result = result.filter(r => r.status === filters.status);
    setFiltered(result);
  };

  const columns = [
    { field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 0.7, minWidth: 90 },
    { field: 'totalFee', headerName: 'Total Fee', flex: 0.7, minWidth: 90, renderCell: (p) => `$${Number(p.value).toLocaleString()}` },
    { field: 'installmentPlan', headerName: 'Installment Plan', flex: 0.8, minWidth: 110 },
    { field: 'amountPaid', headerName: 'Paid', flex: 0.7, minWidth: 90, renderCell: (p) => `$${Number(p.value).toLocaleString()}` },
    { field: 'balance', headerName: 'Balance', flex: 0.7, minWidth: 90, renderCell: (p) => `$${Number(p.value).toLocaleString()}` },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
  ];

  return (
    <Box>
      <PageHeader title="Student Payment Vs Installment" breadcrumbs={breadcrumbs} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Total Students" value={displayData.length} color="#2B4D83" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Total Receivable" value={`$${totalReceivable.toLocaleString()}`} /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Total Collected" value={`$${totalCollected.toLocaleString()}`} color="green" /></Grid>
        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="Outstanding" value={`$${(totalReceivable - totalCollected).toLocaleString()}`} color="orange" /></Grid>
      </Grid>
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={() => setFiltered(null)} />
      <DataTable rows={displayData} columns={columns} exportFilename="payment-vs-installment" />
    </Box>
  );
}