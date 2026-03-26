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

export default function PromocodeSearch() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('promocodes')); }, []);
  const refresh = () => setData(storageService.getAll('promocodes'));

  const searchFields = [
    { name: 'code', label: 'Promo Code' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Expired'] },
  ];

  const columns = [
    { field: 'code', headerName: 'Code', width: 140 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'discountType', headerName: 'Type', width: 120 },
    { field: 'discountValue', headerName: 'Value', width: 100 },
    { field: 'validFrom', headerName: 'Valid From', width: 120 },
    { field: 'validTo', headerName: 'Valid To', width: 120 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value} /> },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button><Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button></Box>),
    },
  ];

  const formFields = [
    { name: 'code', label: 'Promo Code', required: true },
    { name: 'description', label: 'Description', fullWidth: true },
    { name: 'discountType', label: 'Discount Type', type: 'select', options: ['Percentage', 'Fixed Amount'], required: true },
    { name: 'discountValue', label: 'Discount Value', type: 'number', required: true },
    { name: 'validFrom', label: 'Valid From', type: 'date' },
    { name: 'validTo', label: 'Valid To', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];

  const handleSubmit = (v) => {
    if (editing) { storageService.update('promocodes', editing.id, v); enqueueSnackbar('Promocode updated', { variant: 'success' }); }
    else { storageService.create('promocodes', { ...v, status: v.status || 'Active' }); enqueueSnackbar('Promocode created', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Promocode Search" breadcrumbs={[{ label: 'Masters' }, { label: 'Promocodes' }]} actionLabel="Add Promocode" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('promocodes', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="promocodes" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Promocode' : 'Add Promocode'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete Promocode" message="Are you sure?" onConfirm={() => { storageService.remove('promocodes', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}