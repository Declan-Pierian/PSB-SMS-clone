import React, { useState, useCallback, useMemo } from 'react';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
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

const STORAGE_KEY = 'cohorts';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Cohort Management' },
];

export default function CohortManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const programs = useMemo(() => storageService.getAll('programs'), []);
  const intakes = useMemo(() => storageService.getAll('intakes'), []);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const programOptions = useMemo(
    () => programs.map((p) => ({ label: p.name, value: p.name })),
    [programs]
  );

  const intakeOptions = useMemo(
    () => intakes.map((i) => ({ label: i.name, value: i.name })),
    [intakes]
  );

  const searchFields = [
    {
      name: 'program',
      label: 'Program',
      type: 'select',
      options: programOptions,
      gridSize: 3,
    },
    {
      name: 'intake',
      label: 'Intake',
      type: 'select',
      options: intakeOptions,
      gridSize: 3,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Completed', 'Upcoming', 'Cancelled'],
      gridSize: 2,
    },
  ];

  const formFields = [
    { name: 'code', label: 'Cohort Code', type: 'text', required: true },
    {
      name: 'program',
      label: 'Program',
      type: 'select',
      options: programOptions,
      required: true,
    },
    {
      name: 'intake',
      label: 'Intake',
      type: 'select',
      options: intakeOptions,
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Completed', 'Upcoming', 'Cancelled'],
      required: true,
    },
    { name: 'startDate', label: 'Start Date', type: 'date', required: true },
    { name: 'endDate', label: 'End Date', type: 'date', required: true },
    { name: 'maxStudents', label: 'Max Students', type: 'number', required: true },
    { name: 'enrolled', label: 'Enrolled', type: 'number' },
    { name: 'venue', label: 'Venue', type: 'text', fullWidth: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
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
          enqueueSnackbar('Cohort updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, { ...values, enrolled: values.enrolled || 0 });
          enqueueSnackbar('Cohort created successfully', { variant: 'success' });
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
      enqueueSnackbar('Cohort deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'code', headerName: 'Cohort Code', flex: 0.8, minWidth: 110 },
    { field: 'program', headerName: 'Program', flex: 1.5, minWidth: 200 },
    { field: 'intake', headerName: 'Intake', flex: 0.8, minWidth: 110 },
    { field: 'startDate', headerName: 'Start Date', flex: 0.7, minWidth: 100 },
    { field: 'endDate', headerName: 'End Date', flex: 0.7, minWidth: 100 },
    {
      field: 'maxStudents',
      headerName: 'Max',
      flex: 0.4,
      minWidth: 60,
      type: 'number',
    },
    {
      field: 'enrolled',
      headerName: 'Enrolled',
      flex: 0.5,
      minWidth: 70,
      type: 'number',
      renderCell: (params) => {
        const max = params.row.maxStudents || 0;
        const enrolled = params.value || 0;
        const pct = max > 0 ? (enrolled / max) * 100 : 0;
        const color = pct >= 90 ? 'error' : pct >= 70 ? 'warning' : 'success';
        return (
          <Chip
            label={`${enrolled}/${max}`}
            size="small"
            color={color}
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        );
      },
    },
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
        title="Cohort Management"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Cohort"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="cohorts" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Cohort' : 'Add Cohort'}
        fields={formFields}
        initialValues={editItem || { status: 'Upcoming', enrolled: 0 }}
        maxWidth="md"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Cohort"
        message={`Are you sure you want to delete cohort "${deleteItem?.code}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
