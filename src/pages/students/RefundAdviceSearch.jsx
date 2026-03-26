import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Refund Advice Search' }];

export default function RefundAdviceSearch() {
  const { data, handleSearch, handleReset } = useSearch('refunds');

  const searchFields = [
    { name: 'studentName', label: 'Student Name', type: 'text', gridSize: 3 },
    { name: 'studentCode', label: 'Student Code', type: 'text', gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Processed', 'Rejected'], gridSize: 2 },
  ];

  const columns = [
    { field: 'adviceNumber', headerName: 'Advice No', flex: 0.8, minWidth: 110 },
    { field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'amount', headerName: 'Amount', flex: 0.7, minWidth: 90, renderCell: (p) => `$${Number(p.value).toLocaleString()}` },
    { field: 'paymentMethod', headerName: 'Payment Method', flex: 0.8, minWidth: 110 },
    { field: 'bankBranch', headerName: 'Bank', flex: 0.8, minWidth: 100 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
  ];

  return (
    <Box>
      <PageHeader title="Refund Advice Search" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="refund-advice" />
    </Box>
  );
}