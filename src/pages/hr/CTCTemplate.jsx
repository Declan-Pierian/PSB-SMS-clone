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

const STORAGE_KEY = 'ctcTemplates';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'CTC Template' },
];

const STATUSES = ['Active', 'Inactive'];

const searchFields = [
  { name: 'name', label: 'Name', type: 'text', gridSize: 3 },
  { name: 'designation', label: 'Designation', type: 'text', gridSize: 2 },
  { name: 'status', label: 'Status', type: 'select', options: STATUSES, gridSize: 2 },
];

const formFields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'designation', label: 'Designation', type: 'text', required: true },
  { name: 'basicPay', label: 'Basic Pay', type: 'number', required: true },
  { name: 'hra', label: 'HRA', type: 'number' },
  { name: 'transportAllowance', label: 'Transport Allowance', type: 'number' },
  { name: 'otherAllowances', label: 'Other Allowances', type: 'number' },
  { name: 'totalCTC', label: 'Total CTC', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', options: STATUSES, required: true },
];

export default function CTCTemplate() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleAdd = useCallback(() => {
    setEditItem(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    setEditItem(row);
    setFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((row) => {
    setDeleteItem(row);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (values) => {
      try {
        if (editItem) {
          storageService.update(STORAGE_KEY, editItem.id, values);
          enqueueSnackbar('CTC template updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('CTC template created successfully', { variant: 'success' });
        }
        setFormOpen(false);
        setEditItem(null);
        refresh();
      } catch (error) {
        enqueueSnackbar('Operation failed. Please try again.', { variant: 'error' });
      }
    },
    [editItem, enqueueSnackbar, refresh]
  );

  const handleDeleteConfirm = useCallback(() => {
    try {
      storageService.remove(STORAGE_KEY, deleteItem.id);
      enqueueSnackbar('CTC template deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'templateId', headerName: 'Template ID', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
    { field: 'designation', headerName: 'Designation', flex: 1, minWidth: 130 },
    { field: 'basicPay', headerName: 'Basic Pay', flex: 0.8, minWidth: 110 },
    { field: 'hra', headerName: 'HRA', flex: 0.7, minWidth: 100 },
    { field: 'otherAllowances', headerName: 'Other Allowances', flex: 0.9, minWidth: 130 },
    { field: 'totalCTC', headerName: 'Total CTC', flex: 0.8, minWidth: 110 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="CTC Template"
        breadcrumbs={breadcrumbs}
        actionLabel="Add CTC Template"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="ctc_templates" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit CTC Template' : 'Add CTC Template'}
        fields={formFields}
        initialValues={editItem || {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete CTC Template"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}