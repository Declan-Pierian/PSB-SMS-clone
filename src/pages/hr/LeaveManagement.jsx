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

const STORAGE_KEY = 'leaveRequests';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Leave Management' },
];

const LEAVE_TYPES = ['Annual', 'Sick', 'Casual', 'Maternity', 'Paternity'];
const LEAVE_STATUSES = ['Pending', 'Approved', 'Rejected'];

const searchFields = [
  { name: 'employeeName', label: 'Employee Name', type: 'text', gridSize: 3 },
  { name: 'leaveType', label: 'Leave Type', type: 'select', options: LEAVE_TYPES, gridSize: 2 },
  { name: 'status', label: 'Status', type: 'select', options: LEAVE_STATUSES, gridSize: 2 },
  { name: 'fromDate', label: 'From Date', type: 'date', gridSize: 2 },
  { name: 'toDate', label: 'To Date', type: 'date', gridSize: 2 },
];

const formFields = [
  { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
  { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
  { name: 'leaveType', label: 'Leave Type', type: 'select', options: LEAVE_TYPES, required: true },
  { name: 'fromDate', label: 'From Date', type: 'date', required: true },
  { name: 'toDate', label: 'To Date', type: 'date', required: true },
  { name: 'days', label: 'Days', type: 'number' },
  { name: 'reason', label: 'Reason', type: 'textarea', fullWidth: true },
  { name: 'status', label: 'Status', type: 'select', options: LEAVE_STATUSES, required: true },
];

export default function LeaveManagement() {
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
          enqueueSnackbar('Leave request updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Leave request created successfully', { variant: 'success' });
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
      enqueueSnackbar('Leave request deleted successfully', { variant: 'success' });
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
    { field: 'leaveType', headerName: 'Leave Type', flex: 0.8, minWidth: 110 },
    { field: 'fromDate', headerName: 'From Date', flex: 0.8, minWidth: 110 },
    { field: 'toDate', headerName: 'To Date', flex: 0.8, minWidth: 110 },
    { field: 'days', headerName: 'Days', flex: 0.5, minWidth: 70 },
    { field: 'reason', headerName: 'Reason', flex: 1.3, minWidth: 170 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
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
        title="Leave Management"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Leave Request"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="leave_requests" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Leave Request' : 'Add Leave Request'}
        fields={formFields}
        initialValues={editItem || {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Leave Request"
        message={`Are you sure you want to delete the leave request for "${deleteItem?.employeeName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}