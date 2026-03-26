import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'studentCredits';
const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Credit Management' }];

export default function CreditManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const searchFields = [
    { name: 'studentCode', label: 'Student Code', type: 'text', gridSize: 3 },
    { name: 'studentName', label: 'Student Name', type: 'text', gridSize: 3 },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Used', 'Expired'], gridSize: 2 },
  ];

  const formFields = [
    { name: 'studentCode', label: 'Student Code', type: 'text', required: true },
    { name: 'studentName', label: 'Student Name', type: 'text', required: true },
    { name: 'creditAmount', label: 'Credit Amount ($)', type: 'number', required: true },
    { name: 'source', label: 'Source', type: 'select', options: ['Credit Note', 'Refund', 'Overpayment'], required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Used', 'Expired'], required: true },
  ];

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) { storageService.update(STORAGE_KEY, editItem.id, values); enqueueSnackbar('Credit updated', { variant: 'success' }); }
      else { storageService.create(STORAGE_KEY, { ...values, usedAmount: 0, date: new Date().toISOString().split('T')[0] }); enqueueSnackbar('Credit created', { variant: 'success' }); }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'creditAmount', headerName: 'Credit Amount', flex: 0.7, minWidth: 100, renderCell: (p) => `$${Number(p.value || 0).toLocaleString()}` },
    { field: 'usedAmount', headerName: 'Used', flex: 0.6, minWidth: 80, renderCell: (p) => `$${Number(p.value || 0).toLocaleString()}` },
    { field: 'source', headerName: 'Source', flex: 0.8, minWidth: 100 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'actions', headerName: 'Actions', flex: 0.5, minWidth: 70, sortable: false, renderCell: (p) => (
      <Tooltip title="Edit"><IconButton size="small" onClick={() => { setEditItem(p.row); setFormOpen(true); }} color="primary"><EditIcon fontSize="small" /></IconButton></Tooltip>
    )},
  ];

  return (
    <Box>
      <PageHeader title="Credit Management" breadcrumbs={breadcrumbs} actionLabel="Add Credit" actionIcon={<AddIcon />} onAction={() => { setEditItem(null); setFormOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="student-credits" />
      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit Credit' : 'Add Credit'} fields={formFields} initialValues={editItem || { status: 'Active' }} />
    </Box>
  );
}