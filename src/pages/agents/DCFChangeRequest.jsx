import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function DCFChangeRequest() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('dcf_requests')); }, []);
  const refresh = () => setData(storageService.getAll('dcf_requests'));

  const searchFields = [
    { name: 'agentName', label: 'Agent Name' },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'] },
  ];

  const columns = [
    { field: 'id', headerName: 'Request ID', width: 120 },
    { field: 'agentName', headerName: 'Agent Name', flex: 1 },
    { field: 'changeType', headerName: 'Change Type', width: 150 },
    { field: 'currentValue', headerName: 'Current Value', width: 130 },
    { field: 'requestedValue', headerName: 'Requested Value', width: 140 },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'createdAt', headerName: 'Request Date', width: 120, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
    {
      field: 'actions', headerName: 'Actions', width: 180, sortable: false,
      renderCell: (p) => p.row.status === 'Pending' ? (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" color="success" onClick={() => { storageService.update('dcf_requests', p.row.id, { status: 'Approved' }); refresh(); enqueueSnackbar('Request approved', { variant: 'success' }); }}>Approve</Button>
          <Button size="small" color="error" onClick={() => { storageService.update('dcf_requests', p.row.id, { status: 'Rejected' }); refresh(); enqueueSnackbar('Request rejected', { variant: 'warning' }); }}>Reject</Button>
        </Box>
      ) : null,
    },
  ];

  const formFields = [
    { name: 'agentName', label: 'Agent Name', required: true },
    { name: 'changeType', label: 'Change Type', type: 'select', options: ['Commission Rate', 'Territory', 'Contract Terms', 'Payment Terms'], required: true },
    { name: 'currentValue', label: 'Current Value', required: true },
    { name: 'requestedValue', label: 'Requested Value', required: true },
    { name: 'reason', label: 'Reason', type: 'textarea', fullWidth: true, required: true },
  ];

  return (
    <Box>
      <PageHeader title="DCF Change Request" breadcrumbs={[{ label: 'Agent Management' }, { label: 'DCF Change Request' }]} actionLabel="New Request" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('dcf_requests', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="dcf-requests" />
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(v) => { storageService.create('dcf_requests', { ...v, status: 'Pending' }); refresh(); setDialogOpen(false); enqueueSnackbar('Request submitted', { variant: 'success' }); }} title="New DCF Change Request" fields={formFields} />
    </Box>
  );
}