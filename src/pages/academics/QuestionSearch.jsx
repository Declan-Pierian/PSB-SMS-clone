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

const STORAGE_KEY = 'questions';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Question Search' }];

export default function QuestionSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [{ name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'type', label: 'Type', type: 'select', options: ['MCQ', 'Essay', 'Short Answer', 'True-False'], gridSize: 2 }, { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'], gridSize: 2 }];
  const columns = [{ field: 'question', headerName: 'Question', flex: 2, minWidth: 250 },
    { field: 'module', headerName: 'Module', flex: 0.8, minWidth: 100 },
    { field: 'type', headerName: 'Type', flex: 0.6, minWidth: 80 },
    { field: 'difficulty', headerName: 'Difficulty', flex: 0.6, minWidth: 80 },
    { field: 'marks', headerName: 'Marks', flex: 0.4, minWidth: 60 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];
  const formFields = [{ name: 'question', label: 'Question Text', type: 'textarea', fullWidth: true, required: true },
    { name: 'module', label: 'Module', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'select', options: ['MCQ', 'Essay', 'Short Answer', 'True-False'] },
    { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] },
    { name: 'marks', label: 'Marks', type: 'number' },
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
      <PageHeader title="Question Search" breadcrumbs={breadcrumbs} actionLabel="Add" actionIcon={<AddIcon />} onAction={handleAdd} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="questions" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit' : 'Add'} fields={formFields} initialValues={editItem || {}} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Confirm Delete" message="Are you sure?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}
