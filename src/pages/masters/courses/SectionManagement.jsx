import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import SearchForm from '../../../components/common/SearchForm';
import DataTable from '../../../components/common/DataTable';
import FormDialog from '../../../components/common/FormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import StatusChip from '../../../components/common/StatusChip';
import storageService from '../../../services/storageService';
import useSearch from '../../../hooks/useSearch';

const STORAGE_KEY = 'sections';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Section Management' },
];

export default function SectionManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [
    { name: 'name', label: 'Section Name', type: 'text', gridSize: 3 },
    { name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 },
    { name: 'module', label: 'Module', type: 'text', gridSize: 3 },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Completed'], gridSize: 2 },
  ];

  const formFields = [
    { name: 'name', label: 'Section Name', type: 'text', required: true },
    { name: 'code', label: 'Section Code', type: 'text', required: true },
    { name: 'cohort', label: 'Cohort', type: 'text', required: true },
    { name: 'module', label: 'Module', type: 'text', required: true },
    { name: 'instructor', label: 'Instructor', type: 'text' },
    { name: 'capacity', label: 'Capacity', type: 'number' },
    { name: 'room', label: 'Room', type: 'text' },
    { name: 'schedule', label: 'Schedule', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Completed'], required: true },
  ];

  const handleAdd = useCallback(() => { setEditItem(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((row) => { setEditItem(row); setFormOpen(true); }, []);
  const handleDeleteClick = useCallback((row) => { setDeleteItem(row); setDeleteOpen(true); }, []);

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) { storageService.update(STORAGE_KEY, editItem.id, values); enqueueSnackbar('Section updated', { variant: 'success' }); }
      else { storageService.create(STORAGE_KEY, values); enqueueSnackbar('Section created', { variant: 'success' }); }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const handleDeleteConfirm = useCallback(() => {
    try { storageService.remove(STORAGE_KEY, deleteItem.id); enqueueSnackbar('Section deleted', { variant: 'success' }); setDeleteOpen(false); setDeleteItem(null); refresh(); }
    catch { enqueueSnackbar('Delete failed', { variant: 'error' }); }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 90 },
    { field: 'name', headerName: 'Section Name', flex: 1.2, minWidth: 150 },
    { field: 'cohort', headerName: 'Cohort', flex: 1, minWidth: 120 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 120 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 },
    { field: 'capacity', headerName: 'Capacity', flex: 0.5, minWidth: 80 },
    { field: 'room', headerName: 'Room', flex: 0.6, minWidth: 80 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 100, renderCell: (p) => <StatusChip status={p.value} /> },
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
      <PageHeader title="Section Management" breadcrumbs={breadcrumbs} actionLabel="Add Section" actionIcon={<AddIcon />} onAction={handleAdd} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="sections" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit Section' : 'Add Section'} fields={formFields} initialValues={editItem || { status: 'Active' }} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Delete Section" message={`Delete "${deleteItem?.name}"?`} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}