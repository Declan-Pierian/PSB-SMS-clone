import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import FormDialog from '../../../components/common/FormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import storageService from '../../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function PathwayManagement() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('pathways')); }, []);
  const refresh = () => setData(storageService.getAll('pathways'));

  const columns = [
    { field: 'name', headerName: 'Pathway Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'courses', headerName: 'Courses', width: 200 },
    { field: 'prerequisites', headerName: 'Prerequisites', width: 200 },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button><Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button></Box>),
    },
  ];

  const formFields = [
    { name: 'name', label: 'Pathway Name', required: true },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    { name: 'courses', label: 'Courses (comma-separated)', fullWidth: true },
    { name: 'prerequisites', label: 'Prerequisites (comma-separated)', fullWidth: true },
  ];

  const handleSubmit = (v) => {
    if (editing) { storageService.update('pathways', editing.id, v); enqueueSnackbar('Pathway updated', { variant: 'success' }); }
    else { storageService.create('pathways', v); enqueueSnackbar('Pathway created', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Pathway Management" breadcrumbs={[{ label: 'Masters' }, { label: 'Pathways' }]} actionLabel="Add Pathway" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <DataTable rows={data} columns={columns} exportFilename="pathways" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Pathway' : 'Add Pathway'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete Pathway" message="Are you sure?" onConfirm={() => { storageService.remove('pathways', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}