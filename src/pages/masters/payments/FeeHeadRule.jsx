import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
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

const STORAGE_KEY = 'feeHeadRules';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Payments' },
  { label: 'Fee Head Rule' },
];

export default function FeeHeadRule() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const formFields = [
    { name: 'name', label: 'Rule Name', type: 'text', required: true, fullWidth: true },
    { name: 'feeHead', label: 'Fee Head', type: 'select', options: ['Tuition', 'Admin', 'Lab', 'Material', 'Exam', 'Registration'], required: true },
    { name: 'ruleType', label: 'Rule Type', type: 'select', options: ['Percentage', 'Fixed', 'Formula'], required: true },
    { name: 'value', label: 'Value', type: 'number', required: true },
    { name: 'applicableTo', label: 'Applicable To', type: 'select', options: ['All', 'Local', 'International'], required: true },
    { name: 'program', label: 'Program', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true },
  ];

  const handleAdd = useCallback(() => { setEditItem(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((row) => { setEditItem(row); setFormOpen(true); }, []);
  const handleDeleteClick = useCallback((row) => { setDeleteItem(row); setDeleteOpen(true); }, []);

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) { storageService.update(STORAGE_KEY, editItem.id, values); enqueueSnackbar('Rule updated', { variant: 'success' }); }
      else { storageService.create(STORAGE_KEY, values); enqueueSnackbar('Rule created', { variant: 'success' }); }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const handleDeleteConfirm = useCallback(() => {
    try { storageService.remove(STORAGE_KEY, deleteItem.id); enqueueSnackbar('Rule deleted', { variant: 'success' }); setDeleteOpen(false); setDeleteItem(null); refresh(); }
    catch { enqueueSnackbar('Delete failed', { variant: 'error' }); }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'name', headerName: 'Rule Name', flex: 1.2, minWidth: 150 },
    { field: 'feeHead', headerName: 'Fee Head', flex: 0.8, minWidth: 100 },
    { field: 'ruleType', headerName: 'Rule Type', flex: 0.7, minWidth: 100 },
    { field: 'value', headerName: 'Value', flex: 0.5, minWidth: 70 },
    { field: 'applicableTo', headerName: 'Applicable To', flex: 0.8, minWidth: 110 },
    { field: 'program', headerName: 'Program', flex: 1, minWidth: 120 },
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
      <PageHeader title="Fee Head Rule" breadcrumbs={breadcrumbs} actionLabel="Add Rule" actionIcon={<AddIcon />} onAction={handleAdd} />
      <DataTable rows={data} columns={columns} exportFilename="fee-head-rules" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit Rule' : 'Add Rule'} fields={formFields} initialValues={editItem || { status: 'Active' }} />
      <ConfirmDialog open={deleteOpen} title="Delete Rule" message={`Delete "${deleteItem?.name}"?`} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}