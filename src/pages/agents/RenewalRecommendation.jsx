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

const STORAGE_KEY = 'agentRenewals';
const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Renewal Recommendation' }];

export default function RenewalRecommendation() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [{ name: 'agentName', label: 'Agent', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Submitted'], gridSize: 2 }];
  const columns = [{ field: 'agentName', headerName: 'Agent', flex: 1, minWidth: 130 }, { field: 'company', headerName: 'Company', flex: 1, minWidth: 130 }, { field: 'contractEndDate', headerName: 'Contract End', flex: 0.8, minWidth: 100 }, { field: 'performanceScore', headerName: 'Score', flex: 0.5, minWidth: 70 }, { field: 'recommendation', headerName: 'Recommendation', flex: 0.8, minWidth: 110 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];
  const formFields = [{ name: 'agentName', label: 'Agent', type: 'text', required: true }, { name: 'company', label: 'Company', type: 'text' }, { name: 'contractEndDate', label: 'Contract End', type: 'date' }, { name: 'performanceScore', label: 'Score', type: 'number' }, { name: 'recommendation', label: 'Recommendation', type: 'select', options: ['Renew', 'Modify', 'Terminate'] }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Submitted'] }];

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
      <PageHeader title="Renewal Recommendation" breadcrumbs={breadcrumbs} actionLabel="Add" actionIcon={<AddIcon />} onAction={handleAdd} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="agentRenewals" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit' : 'Add'} fields={formFields} initialValues={editItem || {}} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Confirm Delete" message="Are you sure?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />
    </Box>
  );
}
