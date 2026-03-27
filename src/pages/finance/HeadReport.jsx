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

export default function HeadReport() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('headReports');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const searchFields = [
    { name: 'headName', label: 'Head Name', gridSize: 3 },
    { name: 'fromDate', label: 'From Date', type: 'date', gridSize: 2 },
    { name: 'toDate', label: 'To Date', type: 'date', gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], gridSize: 2 },
  ];

  const handleSearchFilters = useCallback(
    (values) => {
      const filters = {};
      if (values.headName) filters.headName = values.headName;
      if (values.fromDate) filters.fromDate = values.fromDate;
      if (values.toDate) filters.toDate = values.toDate;
      if (values.status) filters.status = values.status;
      handleSearch(filters);
    },
    [handleSearch]
  );

  const handleEdit = useCallback((row) => {
    setEditing(row);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id) => {
    setDeleteId(id);
  }, []);

  const handleSubmit = useCallback(
    (values) => {
      if (editing) {
        storageService.update('headReports', editing.id, values);
        enqueueSnackbar('Head report updated successfully', { variant: 'success' });
      } else {
        storageService.create('headReports', {
          ...values,
          headId: `HD-${Date.now().toString().slice(-6)}`,
          transactionCount: 0,
          createdAt: new Date().toISOString(),
        });
        enqueueSnackbar('Head report created successfully', { variant: 'success' });
      }
      setDialogOpen(false);
      setEditing(null);
      refresh();
    },
    [editing, enqueueSnackbar, refresh]
  );

  const handleConfirmDelete = useCallback(() => {
    storageService.remove('headReports', deleteId);
    setDeleteId(null);
    refresh();
    enqueueSnackbar('Head report deleted successfully', { variant: 'success' });
  }, [deleteId, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'headId', headerName: 'Head ID', width: 120 },
    { field: 'headName', headerName: 'Head Name', flex: 1, minWidth: 150 },
    { field: 'headType', headerName: 'Head Type', width: 130 },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'transactionCount', headerName: 'Txn Count', width: 120 },
    { field: 'fromDate', headerName: 'From Date', width: 130 },
    { field: 'toDate', headerName: 'To Date', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'headName', label: 'Head Name', required: true },
    { name: 'headType', label: 'Head Type', type: 'select', options: ['Fee', 'Payment', 'Refund', 'Discount'], required: true },
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'fromDate', label: 'From Date', type: 'date' },
    { name: 'toDate', label: 'To Date', type: 'date' },
    { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], required: true },
  ];

  return (
    <Box>
      <PageHeader
        title="Head Report"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Head Report' },
        ]}
        actionLabel="Add Head Report"
        actionIcon={<AddIcon />}
        onAction={() => { setEditing(null); setDialogOpen(true); }}
      />

      <SearchForm
        fields={searchFields}
        onSearch={handleSearchFilters}
        onReset={handleReset}
      />

      <DataTable
        rows={data}
        columns={columns}
        exportFilename="head-reports"
      />

      <FormDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        title={editing ? 'Edit Head Report' : 'Add Head Report'}
        fields={formFields}
        initialValues={editing || {}}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Head Report"
        message="Are you sure you want to delete this head report?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}