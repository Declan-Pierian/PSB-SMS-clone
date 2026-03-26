import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'activitySlots';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Activity Slots' }];

export default function ActivitySlots() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [{ name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], gridSize: 2 }];
  const columns = [{ field: 'name', headerName: 'Slot', flex: 1, minWidth: 130 },
    { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 },
    { field: 'startTime', headerName: 'Start', flex: 0.5, minWidth: 70 },
    { field: 'endTime', headerName: 'End', flex: 0.5, minWidth: 70 },
    { field: 'room', headerName: 'Room', flex: 0.5, minWidth: 70 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 120 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];
  const formFields = [{ name: 'name', label: 'Slot Name', type: 'text', required: true },
    { name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], required: true },
    { name: 'startTime', label: 'Start Time', type: 'text' },
    { name: 'endTime', label: 'End Time', type: 'text' },
    { name: 'room', label: 'Room', type: 'text' },
    { name: 'module', label: 'Module', type: 'text' },
    { name: 'instructor', label: 'Instructor', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }];

  const handleAdd = useCallback(() => { setEditItem(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((row) => { setEditItem(row); setFormOpen(true); }, []);
  const handleDeleteClick = useCallback((row) => { setDeleteItem(row); setDeleteOpen(true); }, []);

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) { storageService.update(STORAGE_KEY, editItem.id, values); enqueueSnackbar('Updated successfully', { variant: 'success' }); }
      else { storageService.create(STORAGE_KEY, values); enqueueSnackbar('Created successfully', { variant: 'success' }); }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const handleDeleteConfirm = useCallback(() => {
    try { storageService.remove(STORAGE_KEY, deleteItem.id); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); setDeleteItem(null); refresh(); }
    catch { enqueueSnackbar('Delete failed', { variant: 'error' }); }
  }, [deleteItem, enqueueSnackbar, refresh]);

  return (
    <Box>
      <PageHeader title="Activity Slots" breadcrumbs={breadcrumbs} actionLabel="Add" actionIcon={<AddIcon />} onAction={handleAdd} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="activitySlots" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit' : 'Add'} fields={formFields} initialValues={editItem || {}} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Confirm Delete" message="Are you sure?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}
