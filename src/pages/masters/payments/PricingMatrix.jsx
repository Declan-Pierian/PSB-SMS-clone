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

const STORAGE_KEY = 'pricingMatrix';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Payments' },
  { label: 'Pricing Matrix' },
];

export default function PricingMatrix() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [
    { name: 'program', label: 'Program', type: 'text', gridSize: 3 },
    { name: 'nationality', label: 'Nationality', type: 'select', options: ['Local', 'International'], gridSize: 2 },
    { name: 'feeHead', label: 'Fee Head', type: 'select', options: ['Tuition', 'Admin', 'Lab', 'Material', 'Exam', 'Registration'], gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], gridSize: 2 },
  ];

  const formFields = [
    { name: 'program', label: 'Program', type: 'text', required: true },
    { name: 'nationality', label: 'Nationality', type: 'select', options: ['Local', 'International'], required: true },
    { name: 'feeHead', label: 'Fee Head', type: 'select', options: ['Tuition', 'Admin', 'Lab', 'Material', 'Exam', 'Registration'], required: true },
    { name: 'amount', label: 'Amount ($)', type: 'number', required: true },
    { name: 'gst', label: 'GST ($)', type: 'number' },
    { name: 'total', label: 'Total ($)', type: 'number' },
    { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true },
  ];

  const handleAdd = useCallback(() => { setEditItem(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((row) => { setEditItem(row); setFormOpen(true); }, []);
  const handleDeleteClick = useCallback((row) => { setDeleteItem(row); setDeleteOpen(true); }, []);

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) { storageService.update(STORAGE_KEY, editItem.id, values); enqueueSnackbar('Pricing updated', { variant: 'success' }); }
      else { storageService.create(STORAGE_KEY, values); enqueueSnackbar('Pricing created', { variant: 'success' }); }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const handleDeleteConfirm = useCallback(() => {
    try { storageService.remove(STORAGE_KEY, deleteItem.id); enqueueSnackbar('Pricing deleted', { variant: 'success' }); setDeleteOpen(false); setDeleteItem(null); refresh(); }
    catch { enqueueSnackbar('Delete failed', { variant: 'error' }); }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'program', headerName: 'Program', flex: 1.2, minWidth: 150 },
    { field: 'nationality', headerName: 'Nationality', flex: 0.8, minWidth: 110 },
    { field: 'feeHead', headerName: 'Fee Head', flex: 0.8, minWidth: 100 },
    { field: 'amount', headerName: 'Amount', flex: 0.7, minWidth: 90, renderCell: (p) => p.value ? `$${Number(p.value).toLocaleString()}` : '-' },
    { field: 'gst', headerName: 'GST', flex: 0.5, minWidth: 70, renderCell: (p) => p.value ? `$${Number(p.value).toLocaleString()}` : '-' },
    { field: 'total', headerName: 'Total', flex: 0.7, minWidth: 90, renderCell: (p) => p.value ? `$${Number(p.value).toLocaleString()}` : '-' },
    { field: 'effectiveDate', headerName: 'Effective Date', flex: 0.8, minWidth: 110 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
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
      <PageHeader title="Pricing Matrix" breadcrumbs={breadcrumbs} actionLabel="Add Pricing" actionIcon={<AddIcon />} onAction={handleAdd} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="pricing-matrix" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit Pricing' : 'Add Pricing'} fields={formFields} initialValues={editItem || { status: 'Active' }} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Delete Pricing" message="Delete this pricing entry?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}