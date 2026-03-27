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

const STORAGE_KEY = 'workingDays';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Working Days' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = ['2024', '2025', '2026', '2027'];

const searchFields = [
  { name: 'month', label: 'Month', type: 'select', options: MONTHS, gridSize: 2 },
  { name: 'year', label: 'Year', type: 'select', options: YEARS, gridSize: 2 },
  { name: 'department', label: 'Department', type: 'text', gridSize: 3 },
];

const formFields = [
  { name: 'month', label: 'Month', type: 'select', options: MONTHS, required: true },
  { name: 'year', label: 'Year', type: 'select', options: YEARS, required: true },
  { name: 'totalDays', label: 'Total Days', type: 'number', required: true },
  { name: 'workingDays', label: 'Working Days', type: 'number', required: true },
  { name: 'holidays', label: 'Holidays', type: 'number' },
  { name: 'weekends', label: 'Weekends', type: 'number' },
  { name: 'department', label: 'Department', type: 'text' },
];

export default function WorkingDays() {
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
          enqueueSnackbar('Working days updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Working days created successfully', { variant: 'success' });
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
      enqueueSnackbar('Working days record deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'month', headerName: 'Month', flex: 0.9, minWidth: 110 },
    { field: 'year', headerName: 'Year', flex: 0.6, minWidth: 80 },
    { field: 'totalDays', headerName: 'Total Days', flex: 0.7, minWidth: 100 },
    { field: 'workingDays', headerName: 'Working Days', flex: 0.7, minWidth: 110 },
    { field: 'holidays', headerName: 'Holidays', flex: 0.7, minWidth: 90 },
    { field: 'weekends', headerName: 'Weekends', flex: 0.7, minWidth: 90 },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 130 },
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
        title="Working Days"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Working Days"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="working_days" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Working Days' : 'Add Working Days'}
        fields={formFields}
        initialValues={editItem || {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Working Days"
        message={`Are you sure you want to delete the working days record for "${deleteItem?.month} ${deleteItem?.year}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}