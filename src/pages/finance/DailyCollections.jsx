import React, { useState, useMemo } from 'react';
import { Box, Card, CardContent, Typography, TextField, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';
import { PAYMENT_METHODS } from '../../data/constants';

export default function DailyCollections() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const invoices = storageService.getAll('invoices');

  const collections = useMemo(() => {
    return invoices.filter(i => i.status === 'Paid' && (i.paymentDate === date || i.dueDate === date));
  }, [invoices, date]);

  const methodTotals = useMemo(() => {
    const totals = {};
    PAYMENT_METHODS.forEach(m => { totals[m] = 0; });
    collections.forEach(c => { const m = c.paymentMethod || 'CASH'; totals[m] = (totals[m] || 0) + (c.amount || 0); });
    return Object.entries(totals).filter(([_, v]) => v > 0);
  }, [collections]);

  const totalAmount = collections.reduce((s, c) => s + (c.amount || 0), 0);

  const columns = [
    { field: 'invoiceNo', headerName: 'Receipt No', width: 130 },
    { field: 'studentName', headerName: 'Student', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (v) => `$${(v || 0).toLocaleString()}` },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 160 },
    { field: 'program', headerName: 'Program', width: 180 },
  ];

  return (
    <Box>
      <PageHeader title="Daily Collections" breadcrumbs={[{ label: 'Finance' }, { label: 'Daily Collections' }]} />
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
      </Paper>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>${totalAmount.toLocaleString()}</Typography>
            <Typography variant="body2" color="textSecondary">Total Collections</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card><CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2B4D83' }}>{collections.length}</Typography>
            <Typography variant="body2" color="textSecondary">Transactions</Typography>
          </CardContent></Card>
        </Grid>
        {methodTotals.map(([method, amount]) => (
          <Grid size={{ xs: 6, md: 3 }} key={method}>
            <Card><CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>${amount.toLocaleString()}</Typography>
              <Typography variant="body2" color="textSecondary">{method}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <DataTable rows={collections} columns={columns} exportFilename="daily-collections" />
    </Box>
  );
}