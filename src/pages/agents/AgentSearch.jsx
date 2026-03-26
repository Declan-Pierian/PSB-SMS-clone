import React, { useState, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';
import { AGENT_STATUSES, COUNTRIES } from '../../data/constants';

const STORAGE_KEY = 'agents';

const breadcrumbs = [
  { label: 'Agent Management', path: '/agents' },
  { label: 'Agent Search' },
];

const searchFields = [
  { name: 'name', label: 'Agent Name', type: 'text', gridSize: 3 },
  { name: 'company', label: 'Company', type: 'text', gridSize: 3 },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: AGENT_STATUSES,
    gridSize: 3,
  },
];

const formFields = [
  { name: 'agentId', label: 'Agent ID', type: 'text', required: true },
  { name: 'name', label: 'Agent Name', type: 'text', required: true },
  { name: 'company', label: 'Company', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'text', required: true },
  {
    name: 'region',
    label: 'Region',
    type: 'select',
    options: COUNTRIES,
    required: true,
  },
  { name: 'commission', label: 'Commission %', type: 'number', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: AGENT_STATUSES,
    required: true,
  },
  { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
  { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true },
];

export default function AgentSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const handleAdd = useCallback(() => {
    setEditItem(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    setEditItem(row);
    setFormOpen(true);
  }, []);

  const handleView = useCallback((row) => {
    setViewItem(row);
    setViewOpen(true);
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
          enqueueSnackbar('Agent updated successfully', { variant: 'success' });
        } else {
          const contracts = storageService.getAll('contracts').filter(
            (c) => c.agentId === values.agentId
          );
          storageService.create(STORAGE_KEY, { ...values, contractCount: contracts.length });
          enqueueSnackbar('Agent created successfully', { variant: 'success' });
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
      enqueueSnackbar('Agent deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'agentId', headerName: 'Agent ID', flex: 0.8, minWidth: 100 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
    { field: 'company', headerName: 'Company', flex: 1.2, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
    { field: 'phone', headerName: 'Phone', flex: 0.9, minWidth: 120 },
    { field: 'region', headerName: 'Region', flex: 0.8, minWidth: 110 },
    {
      field: 'commission',
      headerName: 'Commission %',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => `${params.value || 0}%`,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'contractCount',
      headerName: 'Contracts',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => params.value || 0,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.9,
      minWidth: 130,
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
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const viewFields = [
    { name: 'agentId', label: 'Agent ID', type: 'text', disabled: true },
    { name: 'name', label: 'Agent Name', type: 'text', disabled: true },
    { name: 'company', label: 'Company', type: 'text', disabled: true },
    { name: 'email', label: 'Email', type: 'text', disabled: true },
    { name: 'phone', label: 'Phone', type: 'text', disabled: true },
    { name: 'region', label: 'Region', type: 'text', disabled: true },
    { name: 'commission', label: 'Commission %', type: 'text', disabled: true },
    { name: 'status', label: 'Status', type: 'text', disabled: true },
    { name: 'address', label: 'Address', type: 'textarea', fullWidth: true, disabled: true },
    { name: 'notes', label: 'Notes', type: 'textarea', fullWidth: true, disabled: true },
  ];

  return (
    <Box>
      <PageHeader
        title="Agent Search"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Agent"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="agents" />

      <FormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Agent' : 'Add Agent'}
        fields={formFields}
        initialValues={editItem || {}}
        maxWidth="md"
      />

      <FormDialog
        open={viewOpen}
        onClose={() => { setViewOpen(false); setViewItem(null); }}
        onSubmit={() => { setViewOpen(false); setViewItem(null); }}
        title="Agent Details"
        fields={viewFields}
        initialValues={viewItem || {}}
        maxWidth="md"
        submitLabel="Close"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Agent"
        message={`Are you sure you want to delete agent "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setDeleteItem(null); }}
      />
    </Box>
  );
}
