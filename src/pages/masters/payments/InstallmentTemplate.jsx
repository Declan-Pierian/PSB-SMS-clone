import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import SearchForm from '../../../components/common/SearchForm';
import DataTable from '../../../components/common/DataTable';
import FormDialog from '../../../components/common/FormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import StatusChip from '../../../components/common/StatusChip';
import storageService from '../../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function InstallmentTemplate() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('installment_templates')); }, []);
  const refresh = () => setData(storageService.getAll('installment_templates'));

  const searchFields = [
    { name: 'name', label: 'Template Name' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];

  const columns = [
    { field: 'name', headerName: 'Template Name', flex: 1 },
    { field: 'installments', headerName: 'Installments', width: 120 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 140, valueFormatter: (v) => v ? `$${Number(v).toLocaleString()}` : '' },
    { field: 'program', headerName: 'Program', width: 200 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value || 'Active'} /> },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button><Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button></Box>),
    },
  ];

  const formFields = [
    { name: 'name', label: 'Template Name', required: true },
    { name: 'installments', label: 'Number of Installments', type: 'number', required: true },
    { name: 'totalAmount', label: 'Total Amount', type: 'number', required: true },
    { name: 'program', label: 'Program' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];

  const handleSubmit = (v) => {
    if (editing) { storageService.update('installment_templates', editing.id, v); enqueueSnackbar('Template updated', { variant: 'success' }); }
    else { storageService.create('installment_templates', { ...v, status: v.status || 'Active' }); enqueueSnackbar('Template created', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Installment Template" breadcrumbs={[{ label: 'Masters' }, { label: 'Installment Templates' }]} actionLabel="Add Template" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('installment_templates', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="installment-templates" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Template' : 'Add Template'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete Template" message="Are you sure?" onConfirm={() => { storageService.remove('installment_templates', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}