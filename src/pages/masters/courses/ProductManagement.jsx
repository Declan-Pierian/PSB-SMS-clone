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

const STORAGE_KEY = 'products';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Product Management' },
];

const productTypes = ['Certificate', 'Diploma', 'Degree', 'Short Course', 'Professional Certificate'];

export default function ProductManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [
    { name: 'name', label: 'Product Name', type: 'text', gridSize: 3 },
    { name: 'code', label: 'Code', type: 'text', gridSize: 2 },
    { name: 'type', label: 'Type', type: 'select', options: productTypes, gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], gridSize: 2 },
  ];

  const formFields = [
    { name: 'name', label: 'Product Name', type: 'text', required: true, fullWidth: true },
    { name: 'code', label: 'Product Code', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'select', options: productTypes, required: true },
    { name: 'program', label: 'Program', type: 'text' },
    { name: 'price', label: 'Price ($)', type: 'number', required: true },
    { name: 'duration', label: 'Duration', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  ];

  const handleAdd = useCallback(() => { setEditItem(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((row) => { setEditItem(row); setFormOpen(true); }, []);
  const handleDeleteClick = useCallback((row) => { setDeleteItem(row); setDeleteOpen(true); }, []);

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) {
        storageService.update(STORAGE_KEY, editItem.id, values);
        enqueueSnackbar('Product updated successfully', { variant: 'success' });
      } else {
        storageService.create(STORAGE_KEY, values);
        enqueueSnackbar('Product created successfully', { variant: 'success' });
      }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const handleDeleteConfirm = useCallback(() => {
    try {
      storageService.remove(STORAGE_KEY, deleteItem.id);
      enqueueSnackbar('Product deleted', { variant: 'success' });
      setDeleteOpen(false); setDeleteItem(null); refresh();
    } catch { enqueueSnackbar('Delete failed', { variant: 'error' }); }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 100 },
    { field: 'name', headerName: 'Product Name', flex: 1.5, minWidth: 200 },
    { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 120 },
    { field: 'program', headerName: 'Program', flex: 1, minWidth: 140 },
    { field: 'price', headerName: 'Price', flex: 0.6, minWidth: 90, renderCell: (p) => p.value ? `$${Number(p.value).toLocaleString()}` : '-' },
    { field: 'duration', headerName: 'Duration', flex: 0.6, minWidth: 90 },
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
      <PageHeader title="Product Management" breadcrumbs={breadcrumbs} actionLabel="Add Product" actionIcon={<AddIcon />} onAction={handleAdd} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="products" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit Product' : 'Add Product'} fields={formFields} initialValues={editItem || { status: 'Active' }} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Delete Product" message={`Delete "${deleteItem?.name}"?`} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}