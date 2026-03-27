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

const STORAGE_KEY = 'employeeTraining';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Employee Training' },
];

const TRAINING_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const YEARS = ['2024', '2025', '2026', '2027'];

const searchFields = [
  { name: 'trainingName', label: 'Training Name', type: 'text', gridSize: 3 },
  { name: 'department', label: 'Department', type: 'text', gridSize: 2 },
  { name: 'status', label: 'Status', type: 'select', options: TRAINING_STATUSES, gridSize: 2 },
  { name: 'year', label: 'Year', type: 'select', options: YEARS, gridSize: 2 },
];

const formFields = [
  { name: 'trainingName', label: 'Training Name', type: 'text', required: true },
  { name: 'department', label: 'Department', type: 'text', required: true },
  { name: 'trainer', label: 'Trainer', type: 'text' },
  { name: 'startDate', label: 'Start Date', type: 'date', required: true },
  { name: 'endDate', label: 'End Date', type: 'date' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'maxParticipants', label: 'Max Participants', type: 'number' },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  { name: 'status', label: 'Status', type: 'select', options: TRAINING_STATUSES, required: true },
];

export default function EmployeeTraining() {
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
          enqueueSnackbar('Training updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Training created successfully', { variant: 'success' });
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
      enqueueSnackbar('Training deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'trainingId', headerName: 'Training ID', flex: 0.7, minWidth: 100 },
    { field: 'trainingName', headerName: 'Training Name', flex: 1.3, minWidth: 170 },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 130 },
    { field: 'trainer', headerName: 'Trainer', flex: 1, minWidth: 120 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.8, minWidth: 110 },
    { field: 'endDate', headerName: 'End Date', flex: 0.8, minWidth: 110 },
    { field: 'participants', headerName: 'Participants', flex: 0.7, minWidth: 100 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 110,
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
        title="Employee Training"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Training"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="employee_training" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Training' : 'Add Training'}
        fields={formFields}
        initialValues={editItem || {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Training"
        message={`Are you sure you want to delete "${deleteItem?.trainingName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}