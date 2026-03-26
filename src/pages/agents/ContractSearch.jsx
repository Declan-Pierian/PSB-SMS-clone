import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';
import { CONTRACT_STATUSES, COUNTRIES } from '../../data/constants';

const STORAGE_KEY = 'contracts';

const breadcrumbs = [
  { label: 'Agent Management', path: '/agents' },
  { label: 'Contract Search' },
];

const searchFields = [
  { name: 'contractId', label: 'Contract ID', type: 'text', gridSize: 3 },
  { name: 'agentName', label: 'Agent Name', type: 'text', gridSize: 3 },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: CONTRACT_STATUSES,
    gridSize: 3,
  },
];

const editFields = [
  { name: 'contractId', label: 'Contract ID', type: 'text', disabled: true },
  { name: 'agentName', label: 'Agent Name', type: 'text', disabled: true },
  {
    name: 'startDate',
    label: 'Start Date',
    type: 'date',
    required: true,
  },
  {
    name: 'endDate',
    label: 'End Date',
    type: 'date',
    required: true,
  },
  {
    name: 'commissionRate',
    label: 'Commission Rate (%)',
    type: 'number',
    required: true,
  },
  {
    name: 'territory',
    label: 'Territory',
    type: 'select',
    options: COUNTRIES,
    required: true,
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: CONTRACT_STATUSES,
    required: true,
  },
  { name: 'terms', label: 'Terms & Conditions', type: 'textarea', fullWidth: true },
];

export default function ContractSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);

  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [terminateItem, setTerminateItem] = useState(null);

  const handleEdit = useCallback((row) => {
    setEditItem(row);
    setEditOpen(true);
  }, []);

  const handleView = useCallback((row) => {
    setViewItem(row);
    setViewOpen(true);
  }, []);

  const handleTerminateClick = useCallback((row) => {
    setTerminateItem(row);
    setTerminateOpen(true);
  }, []);

  const handleEditSubmit = useCallback(
    (values) => {
      try {
        storageService.update(STORAGE_KEY, editItem.id, values);
        enqueueSnackbar('Contract updated successfully', { variant: 'success' });
        setEditOpen(false);
        setEditItem(null);
        refresh();
      } catch (error) {
        enqueueSnackbar('Update failed. Please try again.', { variant: 'error' });
      }
    },
    [editItem, enqueueSnackbar, refresh]
  );

  const handleTerminateConfirm = useCallback(() => {
    try {
      storageService.update(STORAGE_KEY, terminateItem.id, {
        status: 'Terminated',
        terminatedDate: new Date().toISOString().split('T')[0],
      });
      enqueueSnackbar('Contract terminated successfully', { variant: 'success' });
      setTerminateOpen(false);
      setTerminateItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Termination failed. Please try again.', { variant: 'error' });
    }
  }, [terminateItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'contractId', headerName: 'Contract ID', flex: 1, minWidth: 130 },
    { field: 'agentName', headerName: 'Agent Name', flex: 1.2, minWidth: 150 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.8, minWidth: 110 },
    { field: 'endDate', headerName: 'End Date', flex: 0.8, minWidth: 110 },
    {
      field: 'commissionRate',
      headerName: 'Commission %',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Chip label={`${params.value || 0}%`} size="small" variant="outlined" />
      ),
    },
    { field: 'territory', headerName: 'Territory', flex: 0.9, minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(params.row)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {params.row.status === 'Active' && (
            <Tooltip title="Terminate">
              <IconButton size="small" onClick={() => handleTerminateClick(params.row)} color="error">
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const viewFields = [
    { name: 'contractId', label: 'Contract ID', type: 'text', disabled: true },
    { name: 'agentName', label: 'Agent Name', type: 'text', disabled: true },
    { name: 'agentCompany', label: 'Agent Company', type: 'text', disabled: true },
    { name: 'startDate', label: 'Start Date', type: 'text', disabled: true },
    { name: 'endDate', label: 'End Date', type: 'text', disabled: true },
    { name: 'commissionRate', label: 'Commission Rate (%)', type: 'text', disabled: true },
    { name: 'territory', label: 'Territory', type: 'text', disabled: true },
    { name: 'status', label: 'Status', type: 'text', disabled: true },
    { name: 'terms', label: 'Terms & Conditions', type: 'textarea', fullWidth: true, disabled: true },
  ];

  return (
    <Box>
      <PageHeader title="Contract Search" breadcrumbs={breadcrumbs} />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="contracts" />

      <FormDialog
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditItem(null); }}
        onSubmit={handleEditSubmit}
        title="Edit Contract"
        fields={editFields}
        initialValues={editItem || {}}
        maxWidth="md"
      />

      <FormDialog
        open={viewOpen}
        onClose={() => { setViewOpen(false); setViewItem(null); }}
        onSubmit={() => { setViewOpen(false); setViewItem(null); }}
        title="Contract Details"
        fields={viewFields}
        initialValues={viewItem || {}}
        maxWidth="md"
        submitLabel="Close"
      />

      <ConfirmDialog
        open={terminateOpen}
        title="Terminate Contract"
        message={`Are you sure you want to terminate contract "${terminateItem?.contractId}" for agent "${terminateItem?.agentName}"? This action cannot be undone.`}
        onConfirm={handleTerminateConfirm}
        onCancel={() => { setTerminateOpen(false); setTerminateItem(null); }}
        confirmLabel="Terminate"
        severity="error"
      />
    </Box>
  );
}
