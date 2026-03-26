import React, { useState, useMemo } from 'react';
import { Box, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

export default function RevenueReconcile() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const invoices = storageService.getAll('invoices');
  const summary = useMemo(() => {
    const total = invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const collected = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0), 0);
    const partial = invoices.filter(i => i.status === 'Partially Paid').reduce((s, i) => s + (i.paidAmount || 0), 0);
    const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + (i.amount || 0), 0);
    return { total, collected: collected + partial, outstanding: total - collected - partial, overdue };
  }, [invoices]);

  const stats = [
    { label: 'Total Invoiced', value: `$${summary.total.toLocaleString()}`, color: '#2B4D83' },
    { label: 'Total Collected', value: `$${summary.collected.toLocaleString()}`, color: '#2e7d32' },
    { label: 'Outstanding', value: `$${summary.outstanding.toLocaleString()}`, color: '#ed6c02' },
    { label: 'Overdue', value: `$${summary.overdue.toLocaleString()}`, color: '#d32f2f' },
  ];

  const unreconciled = invoices.filter(i => i.status !== 'Cancelled' && !i.reconciled);
  const columns = [
    { field: 'invoiceNo', headerName: 'Invoice No', width: 130 },
    { field: 'studentName', headerName: 'Student', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (v) => `$${(v || 0).toLocaleString()}` },
    { field: 'paidAmount', headerName: 'Paid', width: 120, valueFormatter: (v) => `$${(v || 0).toLocaleString()}` },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'dueDate', headerName: 'Due Date', width: 120 },
    {
      field: 'actions', headerName: 'Actions', width: 140, sortable: false,
      renderCell: (p) => (
        <Button size="small" variant="outlined" onClick={() => { storageService.update('invoices', p.row.id, { reconciled: true }); enqueueSnackbar('Marked as reconciled', { variant: 'success' }); }}>Reconcile</Button>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Revenue Reconcile" breadcrumbs={[{ label: 'Finance' }, { label: 'Revenue Reconcile' }]} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" color="textSecondary">{s.label}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <DataTable rows={unreconciled} columns={columns} exportFilename="revenue-reconcile" />
    </Box>
  );
}
