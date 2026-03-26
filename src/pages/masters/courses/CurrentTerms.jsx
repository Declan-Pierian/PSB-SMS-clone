import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip, Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import FormDialog from '../../../components/common/FormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import StatusChip from '../../../components/common/StatusChip';
import storageService from '../../../services/storageService';
import useSearch from '../../../hooks/useSearch';

const STORAGE_KEY = 'terms';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Current Terms' },
];

export default function CurrentTerms() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const formFields = [
    { name: 'name', label: 'Term Name', type: 'text', required: true, fullWidth: true },
    { name: 'year', label: 'Year', type: 'text', required: true },
    { name: 'term', label: 'Term', type: 'select', options: ['Term 1', 'Term 2', 'Term 3', 'Term 4'], required: true },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Upcoming', 'Completed'], required: true },
  ];

  const handleAdd = useCallback(() => { setEditItem(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((row) => { setEditItem(row); setFormOpen(true); }, []);
  const handleDeleteClick = useCallback((row) => { setDeleteItem(row); setDeleteOpen(true); }, []);

  const handleToggleCurrent = useCallback((row) => {
    try {
      const all = storageService.getAll(STORAGE_KEY);
      all.forEach(t => { t.isCurrent = t.id === row.id; });
      localStorage.setItem(`sms_${STORAGE_KEY}`, JSON.stringify(all));
      enqueueSnackbar(`${row.name} set as current term`, { variant: 'success' });
      refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [enqueueSnackbar, refresh]);

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) { storageService.update(STORAGE_KEY, editItem.id, values); enqueueSnackbar('Term updated', { variant: 'success' }); }
      else { storageService.create(STORAGE_KEY, { ...values, isCurrent: false }); enqueueSnackbar('Term created', { variant: 'success' }); }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const handleDeleteConfirm = useCallback(() => {
    try { storageService.remove(STORAGE_KEY, deleteItem.id); enqueueSnackbar('Term deleted', { variant: 'success' }); setDeleteOpen(false); setDeleteItem(null); refresh(); }
    catch { enqueueSnackbar('Delete failed', { variant: 'error' }); }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'name', headerName: 'Term Name', flex: 1.2, minWidth: 150 },
    { field: 'year', headerName: 'Year', flex: 0.5, minWidth: 70 },
    { field: 'term', headerName: 'Term', flex: 0.6, minWidth: 80 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.8, minWidth: 110 },
    { field: 'endDate', headerName: 'End Date', flex: 0.8, minWidth: 110 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 100, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'isCurrent', headerName: 'Current', flex: 0.5, minWidth: 80, renderCell: (p) => <Switch checked={!!p.value} onChange={() => handleToggleCurrent(p.row)} size="small" /> },
    { field: 'actions', headerName: 'Actions', flex: 0.7, minWidth: 100, sortable: false, filterable: false,
      renderCell: (p) => (
        <Box>
          <Tooltip title="Edit"><IconButton size="small" onClick={() => handleEdit(p.row)} color="primary"><EditIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDeleteClick(p.row)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Current Terms" breadcrumbs={breadcrumbs} actionLabel="Add Term" actionIcon={<AddIcon />} onAction={handleAdd} />
      <DataTable rows={data} columns={columns} exportFilename="terms" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit Term' : 'Add Term'} fields={formFields} initialValues={editItem || { status: 'Active' }} />
      <ConfirmDialog open={deleteOpen} title="Delete Term" message={`Delete "${deleteItem?.name}"?`} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}