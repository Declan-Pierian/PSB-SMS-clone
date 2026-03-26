import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { TICKET_STATUSES, TICKET_TYPES } from '../../data/constants';
import AddIcon from '@mui/icons-material/Add';

export default function TicketSearch() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('tickets')); }, []);
  const refresh = () => setData(storageService.getAll('tickets'));

  const searchFields = [
    { name: 'ticketId', label: 'Ticket ID' },
    { name: 'studentName', label: 'Student Name' },
    { name: 'type', label: 'Type', type: 'select', options: TICKET_TYPES },
    { name: 'status', label: 'Status', type: 'select', options: TICKET_STATUSES },
  ];

  const columns = [
    { field: 'ticketId', headerName: 'Ticket ID', width: 120 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'studentName', headerName: 'Student', width: 150 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'priority', headerName: 'Priority', width: 100 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'assignedTo', headerName: 'Assigned To', width: 130 },
    { field: 'createdAt', headerName: 'Created', width: 110, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
    {
      field: 'actions', headerName: 'Actions', width: 200, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button>
          {p.row.status !== 'Closed' && <Button size="small" color="success" onClick={() => { storageService.update('tickets', p.row.id, { status: 'Closed' }); refresh(); enqueueSnackbar('Ticket closed', { variant: 'success' }); }}>Close</Button>}
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'ticketId', label: 'Ticket ID', required: true, disabled: !!editing },
    { name: 'subject', label: 'Subject', required: true },
    { name: 'studentName', label: 'Student Name', required: true },
    { name: 'type', label: 'Type', type: 'select', options: TICKET_TYPES, required: true },
    { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], required: true },
    { name: 'status', label: 'Status', type: 'select', options: TICKET_STATUSES },
    { name: 'assignedTo', label: 'Assigned To' },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  ];

  const handleSubmit = (values) => {
    if (editing) {
      storageService.update('tickets', editing.id, values);
      enqueueSnackbar('Ticket updated', { variant: 'success' });
    } else {
      storageService.create('tickets', { ...values, status: values.status || 'Open' });
      enqueueSnackbar('Ticket created', { variant: 'success' });
    }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Ticket Search" breadcrumbs={[{ label: 'Student' }, { label: 'Tickets' }]} actionLabel="New Ticket" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('tickets', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="tickets" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Ticket' : 'New Ticket'} fields={formFields} initialValues={editing || {}} maxWidth="md" />
    </Box>
  );
}