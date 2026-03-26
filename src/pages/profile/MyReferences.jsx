import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function MyReferences() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('references')); }, []);
  const refresh = () => setData(storageService.getAll('references'));

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'url', headerName: 'URL', flex: 1, renderCell: (p) => p.value ? <a href={p.value} target="_blank" rel="noopener noreferrer" style={{ color: '#b30537' }}>{p.value}</a> : '' },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
    { field: 'createdAt', headerName: 'Added', width: 110, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button>
          <Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'title', label: 'Title', required: true },
    { name: 'url', label: 'URL' },
    { name: 'category', label: 'Category', type: 'select', options: ['Documentation', 'Tool', 'Contact', 'Other'] },
    { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
  ];

  const handleSubmit = (values) => {
    if (editing) { storageService.update('references', editing.id, values); enqueueSnackbar('Reference updated', { variant: 'success' }); }
    else { storageService.create('references', values); enqueueSnackbar('Reference added', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="My References" breadcrumbs={[{ label: 'Profile' }, { label: 'References' }]} actionLabel="Add Reference" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <DataTable rows={data} columns={columns} exportFilename="references" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Reference' : 'Add Reference'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete Reference" message="Are you sure?" onConfirm={() => { storageService.remove('references', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Reference deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}