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

export default function DiscountsManagement() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('discounts')); }, []);
  const refresh = () => setData(storageService.getAll('discounts'));

  const searchFields = [
    { name: 'name', label: 'Discount Name' },
    { name: 'type', label: 'Type', type: 'select', options: ['Percentage', 'Fixed', 'Early Bird', 'Scholarship'] },
  ];

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'value', headerName: 'Value', width: 100 },
    { field: 'applicableCourses', headerName: 'Applicable Courses', flex: 1 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value || 'Active'} /> },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button><Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button></Box>),
    },
  ];

  const formFields = [
    { name: 'name', label: 'Discount Name', required: true },
    { name: 'type', label: 'Type', type: 'select', options: ['Percentage', 'Fixed', 'Early Bird', 'Scholarship'], required: true },
    { name: 'value', label: 'Value', required: true },
    { name: 'applicableCourses', label: 'Applicable Courses', fullWidth: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];

  const handleSubmit = (v) => {
    if (editing) { storageService.update('discounts', editing.id, v); enqueueSnackbar('Discount updated', { variant: 'success' }); }
    else { storageService.create('discounts', { ...v, status: v.status || 'Active' }); enqueueSnackbar('Discount created', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Discounts Management" breadcrumbs={[{ label: 'Masters' }, { label: 'Discounts' }]} actionLabel="Add Discount" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('discounts', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="discounts" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Discount' : 'Add Discount'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete Discount" message="Are you sure?" onConfirm={() => { storageService.remove('discounts', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}