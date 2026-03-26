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

const STORAGE_KEY = 'intakes';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Intake Management' },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 7 }, (_, i) => String(currentYear - 2 + i));
const termOptions = ['Term 1', 'Term 2', 'Term 3', 'Term 4', 'January', 'April', 'July', 'October'];

export default function IntakeManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const searchFields = [
    {
      name: 'year',
      label: 'Year',
      type: 'select',
      options: yearOptions,
      gridSize: 2,
    },
    {
      name: 'term',
      label: 'Term',
      type: 'select',
      options: termOptions,
      gridSize: 2,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Upcoming', 'Closed', 'Completed'],
      gridSize: 2,
    },
  ];

  const formFields = [
    { name: 'name', label: 'Intake Name', type: 'text', required: true, fullWidth: true },
    {
      name: 'year',
      label: 'Year',
      type: 'select',
      options: yearOptions,
      required: true,
    },
    {
      name: 'term',
      label: 'Term',
      type: 'select',
      options: termOptions,
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Upcoming', 'Closed', 'Completed'],
      required: true,
    },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', required: true },
    { name: 'registrationDeadline', label: 'Registration Deadline', type: 'date' },
    { name: 'maxCapacity', label: 'Max Capacity', type: 'number' },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  ];

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
          enqueueSnackbar('Intake updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Intake created successfully', { variant: 'success' });
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
      enqueueSnackbar('Intake deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'name', headerName: 'Intake Name', flex: 1.5, minWidth: 200 },
    { field: 'year', headerName: 'Year', flex: 0.5, minWidth: 70, type: 'number' },
    { field: 'term', headerName: 'Term', flex: 0.7, minWidth: 100 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.7, minWidth: 110 },
    { field: 'endDate', headerName: 'End Date', flex: 0.7, minWidth: 110 },
    { field: 'registrationDeadline', headerName: 'Reg. Deadline', flex: 0.7, minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
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
        title="Intake Management"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Intake"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="intakes" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Intake' : 'Add Intake'}
        fields={formFields}
        initialValues={editItem || { status: 'Upcoming', year: String(currentYear) }}
        maxWidth="md"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Intake"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
