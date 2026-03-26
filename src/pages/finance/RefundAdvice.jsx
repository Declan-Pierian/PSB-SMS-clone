import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { REFUND_STATUSES } from '../../data/constants';
import AddIcon from '@mui/icons-material/Add';

export default function RefundAdvice() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('refunds')); }, []);
  const refresh = () => setData(storageService.getAll('refunds'));

  const searchFields = [
    { name: 'studentName', label: 'Student Name' },
    { name: 'status', label: 'Status', type: 'select', options: REFUND_STATUSES },
  ];

  const columns = [
    { field: 'refundId', headerName: 'Refund ID', width: 120 },
    { field: 'studentName', headerName: 'Student', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 120, valueFormatter: (v) => `$${(v || 0).toLocaleString()}` },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'bankDetails', headerName: 'Bank Details', width: 160 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'createdAt', headerName: 'Request Date', width: 120, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
    {
      field: 'actions', headerName: 'Actions', width: 220, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {p.row.status === 'Pending' && <><Button size="small" color="success" onClick={() => { storageService.update('refunds', p.row.id, { status: 'Approved' }); refresh(); enqueueSnackbar('Refund approved', { variant: 'success' }); }}>Approve</Button>
          <Button size="small" color="error" onClick={() => { storageService.update('refunds', p.row.id, { status: 'Rejected' }); refresh(); enqueueSnackbar('Refund rejected', { variant: 'warning' }); }}>Reject</Button></>}
          {p.row.status === 'Approved' && <Button size="small" color="info" onClick={() => { storageService.update('refunds', p.row.id, { status: 'Processed' }); refresh(); enqueueSnackbar('Refund processed', { variant: 'success' }); }}>Process</Button>}
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'refundId', label: 'Refund ID', required: true },
    { name: 'studentName', label: 'Student Name', required: true },
    { name: 'amount', label: 'Amount', type: 'number', required: true },
    { name: 'reason', label: 'Reason', required: true },
    { name: 'bankDetails', label: 'Bank Details' },
  ];

  return (
    <Box>
      <PageHeader title="Refund Advice Search" breadcrumbs={[{ label: 'Finance' }, { label: 'Refund Advice' }]} actionLabel="New Refund" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('refunds', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="refunds" />
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(v) => { storageService.create('refunds', { ...v, status: 'Pending' }); refresh(); setDialogOpen(false); enqueueSnackbar('Refund request created', { variant: 'success' }); }} title="New Refund Request" fields={formFields} />
    </Box>
  );
}