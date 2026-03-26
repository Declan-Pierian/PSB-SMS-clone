import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { PAYMENT_METHODS } from '../../data/constants';

export default function RevenueSearch() {
  const [data, setData] = useState(storageService.getAll('invoices').filter(i => i.status === 'Paid' || i.status === 'Partially Paid'));

  const searchFields = [
    { name: 'studentName', label: 'Student Name' },
    { name: 'program', label: 'Program' },
    { name: 'paymentMethod', label: 'Payment Method', type: 'select', options: PAYMENT_METHODS },
  ];

  const columns = [
    { field: 'invoiceNo', headerName: 'Invoice No', width: 130 },
    { field: 'studentName', headerName: 'Student', flex: 1 },
    { field: 'program', headerName: 'Program', width: 180 },
    { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (v) => `$${(v || 0).toLocaleString()}` },
    { field: 'paidAmount', headerName: 'Paid Amount', width: 120, valueFormatter: (v) => `$${(v || 0).toLocaleString()}` },
    { field: 'paymentMethod', headerName: 'Method', width: 140 },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'dueDate', headerName: 'Date', width: 120 },
  ];

  const total = data.reduce((s, i) => s + (i.paidAmount || i.amount || 0), 0);

  return (
    <Box>
      <PageHeader title="Revenue Search" breadcrumbs={[{ label: 'Finance' }, { label: 'Revenue Search' }]} />
      <SearchForm fields={searchFields} onSearch={(f) => {
        const all = storageService.getAll('invoices').filter(i => i.status === 'Paid' || i.status === 'Partially Paid');
        const filtered = all.filter(i => {
          if (f.studentName && !i.studentName?.toLowerCase().includes(f.studentName.toLowerCase())) return false;
          if (f.program && !i.program?.toLowerCase().includes(f.program.toLowerCase())) return false;
          if (f.paymentMethod && i.paymentMethod !== f.paymentMethod) return false;
          return true;
        });
        setData(filtered);
      }} onReset={() => setData(storageService.getAll('invoices').filter(i => i.status === 'Paid' || i.status === 'Partially Paid'))} />
      <DataTable rows={data} columns={columns} exportFilename="revenue" toolbar={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Total Revenue: ${total.toLocaleString()}</Typography>} />
    </Box>
  );
}