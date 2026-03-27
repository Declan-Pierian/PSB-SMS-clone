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

const STORAGE_KEY = 'payslips';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Bulk Payslips' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = ['2024', '2025', '2026', '2027'];
const STATUSES = ['Generated', 'Pending', 'Sent'];

const searchFields = [
  { name: 'month', label: 'Month', type: 'select', options: MONTHS, gridSize: 2 },
  { name: 'year', label: 'Year', type: 'select', options: YEARS, gridSize: 2 },
  { name: 'department', label: 'Department', type: 'text', gridSize: 3 },
  { name: 'status', label: 'Status', type: 'select', options: STATUSES, gridSize: 2 },
];

const formFields = [
  { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
  { name: 'employeeName', label: 'Employee Name', type: 'text' },
  { name: 'department', label: 'Department', type: 'text' },
  { name: 'month', label: 'Month', type: 'select', options: MONTHS, required: true },
  { name: 'year', label: 'Year', type: 'select', options: YEARS, required: true },
  { name: 'grossAmount', label: 'Gross Amount', type: 'number', required: true },
  { name: 'deductions', label: 'Deductions', type: 'number' },
  { name: 'netAmount', label: 'Net Amount', type: 'number' },
  { name: 'status', label: 'Status', type: 'select', options: STATUSES, required: true },
];

export default function BulkPayslips() {
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
          enqueueSnackbar('Payslip updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Payslip created successfully', { variant: 'success' });
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
      enqueueSnackbar('Payslip deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'employeeId', headerName: 'Employee ID', flex: 0.8, minWidth: 110 },
    { field: 'employeeName', headerName: 'Employee Name', flex: 1.2, minWidth: 150 },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 130 },
    { field: 'month', headerName: 'Month', flex: 0.7, minWidth: 100 },
    { field: 'year', headerName: 'Year', flex: 0.6, minWidth: 80 },
    { field: 'grossAmount', headerName: 'Gross Amount', flex: 0.8, minWidth: 120 },
    { field: 'deductions', headerName: 'Deductions', flex: 0.8, minWidth: 110 },
    { field: 'netAmount', headerName: 'Net Amount', flex: 0.8, minWidth: 120 },
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
        title="Bulk Payslips"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Payslip"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="payslips" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Payslip' : 'Add Payslip'}
        fields={formFields}
        initialValues={editItem || {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Payslip"
        message={`Are you sure you want to delete the payslip for "${deleteItem?.employeeName || deleteItem?.employeeId}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}