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

const STORAGE_KEY = 'testStructures';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Test Structure' }];

export default function TestStructure() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [{ name: 'testName', label: 'Test', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'testName', headerName: 'Test', flex: 1, minWidth: 150 },
    { field: 'sectionName', headerName: 'Section', flex: 1, minWidth: 130 },
    { field: 'questionType', headerName: 'Question Type', flex: 0.8, minWidth: 100 },
    { field: 'numQuestions', headerName: 'Questions', flex: 0.5, minWidth: 80 },
    { field: 'marksPerQuestion', headerName: 'Marks/Q', flex: 0.5, minWidth: 80 },
    { field: 'totalMarks', headerName: 'Total Marks', flex: 0.6, minWidth: 90 }];
  const formFields = [{ name: 'testName', label: 'Test', type: 'text', required: true },
    { name: 'sectionName', label: 'Section Name', type: 'text', required: true },
    { name: 'questionType', label: 'Question Type', type: 'select', options: ['MCQ', 'Essay', 'Short Answer', 'True/False', 'Practical'] },
    { name: 'numQuestions', label: 'No. of Questions', type: 'number' },
    { name: 'marksPerQuestion', label: 'Marks Per Question', type: 'number' },
    { name: 'totalMarks', label: 'Total Marks', type: 'number' }];

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
      <PageHeader title="Test Structure" breadcrumbs={breadcrumbs} actionLabel="Add" actionIcon={<AddIcon />} onAction={handleAdd} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="testStructures" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit' : 'Add'} fields={formFields} initialValues={editItem || {}} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Confirm Delete" message="Are you sure?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}
