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

const STORAGE_KEY = 'schools';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Partners', path: '/masters/search-bu' },
  { label: 'Business Units' },
];

const searchFields = [
  { name: 'name', label: 'Business Unit Name', type: 'text', gridSize: 3 },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['Active', 'Inactive'],
    gridSize: 3,
  },
];

const formFields = [
  { name: 'name', label: 'Business Unit Name', type: 'text', required: true },
  { name: 'code', label: 'BU Code', type: 'text', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: ['Active', 'Inactive'],
    required: true,
  },
  { name: 'country', label: 'Country', type: 'text', required: true },
  { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
  { name: 'contactPhone', label: 'Contact Phone', type: 'text' },
  { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
];

export default function SearchBU() {
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
          enqueueSnackbar('Business Unit updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Business Unit created successfully', { variant: 'success' });
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
      enqueueSnackbar('Business Unit deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'code', headerName: 'BU Code', flex: 0.8, minWidth: 100 },
    { field: 'name', headerName: 'Business Unit Name', flex: 1.5, minWidth: 180 },
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 120 },
    { field: 'contactEmail', headerName: 'Contact Email', flex: 1.2, minWidth: 180 },
    { field: 'contactPhone', headerName: 'Phone', flex: 0.8, minWidth: 120 },
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
        title="Business Units"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Business Unit"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="business-units" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Business Unit' : 'Add Business Unit'}
        fields={formFields}
        initialValues={editItem || {}}
        maxWidth="md"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Business Unit"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
