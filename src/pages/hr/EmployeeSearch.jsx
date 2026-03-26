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
import {
  EMPLOYEE_TYPES,
  EMPLOYEE_DESIGNATIONS,
  EMPLOYEE_STATUSES,
} from '../../data/constants';

const STORAGE_KEY = 'employees';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Employee Search' },
];

const DEPARTMENTS = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Arts & Social Sciences',
  'Finance',
  'Human Resources',
  'Marketing',
  'Operations',
  'Student Services',
  'IT Support',
];

const searchFields = [
  { name: 'employeeId', label: 'Employee ID', type: 'text', gridSize: 3 },
  { name: 'name', label: 'Name', type: 'text', gridSize: 3 },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, gridSize: 3 },
  { name: 'designation', label: 'Designation', type: 'select', options: EMPLOYEE_DESIGNATIONS, gridSize: 3 },
  { name: 'type', label: 'Type', type: 'select', options: EMPLOYEE_TYPES, gridSize: 3 },
  { name: 'status', label: 'Status', type: 'select', options: EMPLOYEE_STATUSES, gridSize: 3 },
];

const formFields = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'text', required: true },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true },
  { name: 'designation', label: 'Designation', type: 'select', options: EMPLOYEE_DESIGNATIONS, required: true },
  { name: 'type', label: 'Employee Type', type: 'select', options: EMPLOYEE_TYPES, required: true },
  { name: 'joinDate', label: 'Join Date', type: 'date', required: true },
  { name: 'status', label: 'Status', type: 'select', options: EMPLOYEE_STATUSES, required: true },
  { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
];

export default function EmployeeSearch() {
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
          enqueueSnackbar('Employee updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Employee created successfully', { variant: 'success' });
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
      enqueueSnackbar('Employee deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'employeeId', headerName: 'Employee ID', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 140 },
    { field: 'designation', headerName: 'Designation', flex: 1, minWidth: 140 },
    { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 110 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
    { field: 'phone', headerName: 'Phone', flex: 0.8, minWidth: 120 },
    { field: 'joinDate', headerName: 'Join Date', flex: 0.8, minWidth: 110 },
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
        title="Employee Search"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Employee"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="employees" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Employee' : 'Add Employee'}
        fields={formFields}
        initialValues={editItem || {}}
        maxWidth="md"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteItem?.name}" (${deleteItem?.employeeId})? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
